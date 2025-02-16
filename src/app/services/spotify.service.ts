import { Injectable } from '@angular/core';
import {
    SimplifiedTrack,
    SpotifyApi,
    UserProfile,
} from '@spotify/web-api-ts-sdk';
import { environment } from '../../environments/environment';
import { BehaviorSubject, from, map, Observable, switchMap, tap } from 'rxjs';
import { SpotifyPlayerService } from './spotify-player.service';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class SpotifyService {
    private spotify!: SpotifyApi;
    public userProfile$ = new BehaviorSubject<UserProfile | null>(null);
    public currentTrack$ = this.spotifyPlayerService.currentTrack$;
    public isPlaying$ = this.spotifyPlayerService.isPlaying$;

    constructor(
        private spotifyPlayerService: SpotifyPlayerService,
        private storageService: StorageService,
    ) {}

    initialize() {
        this.spotify = SpotifyApi.withUserAuthorization(
            environment.spotify.clientId,
            environment.spotify.redirectUri,
            [
                'user-read-email',
                'playlist-read-private',
                'streaming',
                'user-read-playback-state',
                'user-modify-playback-state',
            ],
        );

        from(this.spotify.currentUser.profile())
            .pipe(
                tap((userProfile) => {
                    this.userProfile$.next(userProfile);
                }),
                // access token is only available after first request to API has been made
                switchMap(() => from(this.spotify.getAccessToken())),
                tap((accessToken) => {
                    if (accessToken?.access_token) {
                        this.initializePlayerService(accessToken.access_token);
                    }
                }),
            )
            .subscribe();

        this.currentTrack$.subscribe((track) => {
            const albumId = track.album.uri.replace('spotify:album:', '');
            this.storageService.saveLastPlayedTrack(albumId, track.id);
        });
    }

    private initializePlayerService(accessToken: string) {
        this.spotifyPlayerService.initialize(accessToken).subscribe();
    }

    togglePlay() {
        this.spotifyPlayerService.togglePlay();
    }

    skipToNextTrack() {
        this.spotifyPlayerService.skipToNextTrack();
    }

    skipToPrevTrack() {
        this.spotifyPlayerService.skipToPrevTrack();
    }

    searchAlbums(query: string) {
        return from(this.spotify.search(query, ['album']));
    }

    getAlbums(albumIds: string[]) {
        return from(this.spotify.albums.get(albumIds));
    }

    getAlbumTracks(albumId: string): Observable<SimplifiedTrack[]> {
        return from(this.spotify.albums.get(albumId)).pipe(
            map((album) => album.tracks.items),
        );
    }

    playAlbum(albumId: string) {
        const lastPlayedTrack = this.storageService.getLastPlayedTrack(albumId);

        let offSet: object | undefined = undefined;
        if (lastPlayedTrack) {
            offSet = {
                uri: `spotify:track:${lastPlayedTrack}`,
            };
        }

        this.spotifyPlayerService.deviceId$
            .pipe(
                tap((deviceId) => {
                    if (deviceId) {
                        this.spotify.player.startResumePlayback(
                            deviceId,
                            `spotify:album:${albumId}`,
                            undefined,
                            offSet,
                        );
                    }
                }),
            )
            .subscribe();
    }
}
