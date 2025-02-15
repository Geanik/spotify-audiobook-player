import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { SpotifyService } from '../../services/spotify.service';
import { tap } from 'rxjs';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    savedAlbums: any[] = [];

    constructor(
        private storageService: StorageService,
        private spotifyService: SpotifyService,
    ) {}

    ngOnInit(): void {
        const albumIds = this.storageService.getAllSavedAlbumIds();
        this.spotifyService
            .getAlbums(albumIds)
            .pipe(tap((albums) => (this.savedAlbums = albums)))
            .subscribe();
    }
}
