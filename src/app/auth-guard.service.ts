import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SpotifyService } from './services/spotify.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
    constructor(
        private spotifyService: SpotifyService,
        private router: Router,
    ) {}

    canActivate(): boolean {
        if (this.spotifyService.isAuthenticated()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
