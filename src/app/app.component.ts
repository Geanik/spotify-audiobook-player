import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpotifyService } from './services/spotify.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, AsyncPipe],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'spotify-audiobook-player';
    userDisplayName$ = this.spotifyService.userProfile$.pipe(
        map((profile) => profile?.display_name ?? 'Guest'),
    );

    constructor(private spotifyService: SpotifyService) {}
}
