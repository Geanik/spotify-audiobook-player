import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SpotifyService } from './services/spotify.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { MediaControlComponent } from './components/media-control/media-control.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { MediaSessionService } from './services/media-session.service';

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
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({
                    transform: 'translateY(100%)',
                    opacity: 0,
                }),
                animate(
                    '200ms ease-out',
                    style({
                        transform: 'translateY(0)',
                        opacity: 1,
                    }),
                ),
            ]),
        ]),
    ],
})
export class AppComponent implements OnInit {
    title = 'spotify-audiobook-player';
    isMenuCollapsed = true;
    userDisplayName$ = this.spotifyService.userProfile$.pipe(
        map((profile) => profile?.display_name ?? 'Guest'),
    );
    showMediaControl$ = this.spotifyService.currentTrack$.pipe(
        map((track) => track !== null),
    );

    constructor(
        private spotifyService: SpotifyService,
        private mediaSessionService: MediaSessionService,
    ) {}

    ngOnInit(): void {
        this.spotifyService.initialize();
        this.mediaSessionService.initialize();
    }
}
