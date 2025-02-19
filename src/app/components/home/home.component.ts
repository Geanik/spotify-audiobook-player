import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { SpotifyService } from '../../services/spotify.service';
import { tap } from 'rxjs';
import { AlbumCardComponent } from '../album-card/album-card.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [AlbumCardComponent, RouterLink],
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

    onAlbumClick(albumId: string) {
        this.spotifyService.playAlbum(albumId);
    }

    onDeleteAlbum(albumId: string) {
        this.storageService.removeAlbum(albumId);
        this.savedAlbums = this.savedAlbums.filter(
            (album) => album.id !== albumId,
        );
    }
}
