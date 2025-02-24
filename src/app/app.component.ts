import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SpotifyService } from './services/spotify.service';
import { map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {
    NgbCollapse,
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { MediaControlComponent } from './components/media-control/media-control.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastComponent } from './components/toast/toast.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        AsyncPipe,
        RouterLink,
        RouterLinkActive,
        NgbCollapse,
        MediaControlComponent,
        NgbDropdownToggle,
        NgbDropdownMenu,
        NgbDropdownItem,
        NgbDropdown,
        ToastComponent,
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
    title = 'Audiobook Player';
    isMenuCollapsed = true;
    userDisplayName$ = this.spotifyService.userProfile$.pipe(
        map((profile) => profile?.display_name ?? 'Guest'),
    );
    userAvatarUrl$ = this.spotifyService.userProfile$.pipe(
        map((profile) => profile?.images?.[0]?.url),
    );
    showMediaControl$ = this.spotifyService.currentTrack$.pipe(
        map((track) => track !== null),
    );

    constructor(private spotifyService: SpotifyService) {}

    ngOnInit(): void {
        this.spotifyService.initialize();
    }

    onLogout() {
        this.spotifyService
            .logout()
            .pipe(tap(() => this.spotifyService.initialize()))
            .subscribe();
    }
}
