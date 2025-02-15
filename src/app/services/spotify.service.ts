import { Injectable } from '@angular/core';
import {
    SimplifiedTrack,
    SpotifyApi,
    UserProfile,
} from '@spotify/web-api-ts-sdk';
import { environment } from '../../environments/environment';
import { BehaviorSubject, from, map, Observable, switchMap, tap } from 'rxjs';
import { SpotifyPlayerService } from './spotify-player.service';

@Injectable({
    providedIn: 'root',
})
export class SpotifyService {
    private spotify: SpotifyApi;
    public userProfile$ = new BehaviorSubject<UserProfile | null>(null);

    constructor(private spotifyPlayerService: SpotifyPlayerService) {
        this.spotify = SpotifyApi.withUserAuthorization(
            environment.spotify.clientId,
            environment.spotify.clientId,
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
    }

    private initializePlayerService(accessToken: string) {
        this.spotifyPlayerService.initialize(accessToken).subscribe();
    }

    searchAlbums(query: string) {
        return from(this.spotify.search(query, ['album']));
    }

    getAlbumTracks(albumId: string): Observable<SimplifiedTrack[]> {
        return from(this.spotify.albums.get(albumId)).pipe(
            map((album) => album.tracks.items),
        );
    }

    playTrack(trackId: string) {
        this.playMedia({ uris: [`spotify:track:${trackId}`] });
    }

    playAlbum(albumId: string) {
        this.playMedia({ contextUri: `spotify:album:${albumId}` });
    }

    private playMedia(options: { contextUri?: string; uris?: string[] }) {
        this.spotifyPlayerService.deviceId$
            .pipe(
                tap((deviceId) => {
                    if (deviceId) {
                        this.spotify.player.startResumePlayback(
                            deviceId,
                            options.contextUri,
                            options.uris,
                        );
                    }
                }),
            )
            .subscribe();
    }
}
