import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SpotifyService } from './services/spotify.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { MediaControlComponent } from './components/media-control/media-control.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        AsyncPipe,
        RouterLink,
        RouterLinkActive,
        NgbCollapse,
        MediaControlComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'spotify-audiobook-player';
    isMenuCollapsed = true;
    userDisplayName$ = this.spotifyService.userProfile$.pipe(
        map((profile) => profile?.display_name ?? 'Guest'),
    );

    constructor(private spotifyService: SpotifyService) {}
}
