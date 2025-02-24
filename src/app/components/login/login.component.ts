import { Component } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    constructor(private spotifyService: SpotifyService) {}

    loginWithSpotify() {
        this.spotifyService.initialize();
    }
}
