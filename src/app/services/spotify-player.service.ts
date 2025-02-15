import { Injectable } from '@angular/core';
import { from, map, Observable, ReplaySubject, switchMap, tap } from 'rxjs';

declare global {
    interface Window {
        Spotify: any;
        onSpotifyWebPlaybackSDKReady: () => void;
    }
}

@Injectable({
    providedIn: 'root',
})
export class SpotifyPlayerService {
    private player: any;

    private deviceId = new ReplaySubject<string>(1);
    public deviceId$ = this.deviceId.asObservable();

    constructor() {
        this.defineSpotifyCallback();
    }

    private defineSpotifyCallback() {
        // no idea why his helps but it fixes the following error: Uncaught AnthemError: onSpotifyWebPlaybackSDKReady is not defined
        if (!window.onSpotifyWebPlaybackSDKReady) {
            window.onSpotifyWebPlaybackSDKReady = () => {
                console.log('Spotify Web Playback SDK is ready!');
            };
        }
    }

    initialize(token: string): Observable<boolean> {
        return this.loadSpotifySDK().pipe(
            tap(() => {
                this.player = new window.Spotify.Player({
                    name: 'Audiobook player',
                    getOAuthToken: (cb: (token: string) => void) => {
                        cb(token);
                    },
                });
                this.registerPlayerEventListeners();
            }),
            switchMap(() => from(this.player.connect())),
            map((result) => Boolean(result)),
            tap((connected) => {
                if (connected) {
                    console.log('Player connected successfully');
                } else {
                    console.error('Failed to connect player');
                }
            }),
        );
    }

    private registerPlayerEventListeners() {
        this.player.addListener('initialization_error', ({ message }: any) => {
            console.error(message);
        });
        this.player.addListener('authentication_error', ({ message }: any) => {
            console.error(message);
        });
        this.player.addListener('account_error', ({ message }: any) => {
            console.error(message);
        });
        this.player.addListener('playback_error', ({ message }: any) => {
            console.error(message);
        });
        this.player.addListener('ready', ({ device_id }: any) => {
            console.log('Spotify Player is ready with Device ID', device_id);
            this.deviceId.next(device_id);
            // You might want to transfer playback to this device using the Web API
        });
        this.player.addListener('not_ready', ({ device_id }: any) => {
            console.log('Device ID has gone offline', device_id);
        });
    }

    // this could maybe be removed
    private loadSpotifySDK(): Observable<void> {
        return new Observable<void>((observer) => {
            if (window.Spotify) {
                observer.next();
                observer.complete();
            } else {
                const script = document.createElement('script');
                script.src = 'https://sdk.scdn.co/spotify-player.js';
                script.onload = () => {
                    observer.next();
                    observer.complete();
                };
                script.onerror = () =>
                    observer.error(new Error('Spotify SDK failed to load'));
                document.head.appendChild(script);
            }
        });
    }
}
