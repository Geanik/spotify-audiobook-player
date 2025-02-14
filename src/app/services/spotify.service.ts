import { Injectable } from '@angular/core';
import { SpotifyApi, UserProfile } from '@spotify/web-api-ts-sdk';
import { environment } from '../../environments/environment';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SpotifyService {
    private spotify: SpotifyApi;

    constructor() {
        this.spotify = SpotifyApi.withUserAuthorization(
            environment.spotify.clientId,
            environment.spotify.clientId,
            ['user-read-email', 'playlist-read-private'],
        );
    }

    searchAlbums(query: string) {
        return from(this.spotify.search(query, ['album']));
    }
}
