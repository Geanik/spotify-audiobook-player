import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { SpotifyService } from '../../services/spotify.service';
import { tap } from 'rxjs';
import { AlbumCardComponent } from '../album-card/album-card.component';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';

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
        private toastService: ToastService,
    ) {}

    ngOnInit(): void {
        const albumIds = this.storageService.getAllSavedAlbumIds();
        this.spotifyService
            .getAlbums(albumIds)
            .pipe(
                tap((albums) => (this.savedAlbums = albums)),
                this.toastService.withErrorToast('Failed to load library'),
            )
            .subscribe();
    }

    onAlbumClick(albumId: string) {
        this.spotifyService
            .playAlbum(albumId)
            .pipe(this.toastService.withErrorToast('Failed to play album'))
            .subscribe();
    }

    onDeleteAlbum(albumId: string) {
        try {
            this.storageService.removeAlbum(albumId);
            this.savedAlbums = this.savedAlbums.filter(
                (album) => album.id !== albumId,
            );
            this.toastService.showSuccess('Album removed from library');
        } catch (error) {
            this.toastService.showError('Failed to remove album from library');
        }
    }
}
