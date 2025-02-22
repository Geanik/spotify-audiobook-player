import { Injectable } from '@angular/core';
import { SpotifyService } from './spotify.service';
import { tap } from 'rxjs';
import { Image } from '@spotify/web-api-ts-sdk';

@Injectable({
    providedIn: 'root',
})
export class MediaSessionService {
    constructor(private spotifyService: SpotifyService) {}

    initialize() {
        if (!this.mediaSessionIsSupported()) {
            console.log('MediaSession not available');
            return;
        }

        this.initializeActionHandlers();
        this.updateMetadataOnSpotifyTrackChanged();

        console.log('MediaSession set up finished');
    }

    private mediaSessionIsSupported(): boolean {
        return 'mediaSession' in navigator;
    }

    private updateMetadataOnSpotifyTrackChanged() {
        this.spotifyService.currentTrack$
            .pipe(
                tap((track) => {
                    if (track) {
                        console.log('Updating MediaSession metadata', track);
                        const artworks = track.album.images.map(
                            (image: Image) => ({
                                src: image.url,
                                sizes: `${image.width}x${image.height}`,
                                type: 'image/jpeg',
                            }),
                        );

                        navigator.mediaSession.metadata = new MediaMetadata({
                            title: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            artwork: artworks,
                        });
                    }
                }),
            )
            .subscribe();
    }

    private initializeActionHandlers(): void {
        this.setActionHandler('play', () => this.spotifyService.togglePlay());
        this.setActionHandler('pause', () => this.spotifyService.togglePlay());
        this.setActionHandler('nexttrack', () =>
            this.spotifyService.skipToNextTrack(),
        );
        this.setActionHandler('previoustrack', () =>
            this.spotifyService.skipToPrevTrack(),
        );
    }

    private setActionHandler(
        action: MediaSessionAction,
        handler: MediaSessionActionHandler | null,
    ): void {
        if (this.mediaSessionIsSupported()) {
            try {
                navigator.mediaSession.setActionHandler(action, handler);
            } catch (error) {
                console.warn(
                    `The media session action "${action}" is not supported.`,
                    error,
                );
            }
        }
    }
}
