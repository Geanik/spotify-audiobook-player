import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { SpotifyService } from '../../services/spotify.service';
import { switchMap, tap } from 'rxjs';
import { AlbumCardComponent } from '../album-card/album-card.component';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { AlbumCardSkeletonComponent } from '../album-card/album-card-skeleton/album-card-skeleton.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-home',
    imports: [AlbumCardComponent, RouterLink, AlbumCardSkeletonComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    animations: [
        trigger('fadeAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('200ms 155ms ease-in', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate('150ms ease-out', style({ opacity: 0 })),
            ]),
        ]),
    ],
})
export class HomeComponent implements OnInit {
    isLoading = true;
    savedAlbums: any[] = [];

    constructor(
        private storageService: StorageService,
        private spotifyService: SpotifyService,
        private toastService: ToastService,
    ) {}

    ngOnInit(): void {
        this.storageService
            .getSavedAlbumIds()
            .pipe(
                switchMap((albumIds) => {
                    this.isLoading = true;
                    return this.spotifyService.getAlbums(albumIds);
                }),
                tap((albums) => {
                    this.savedAlbums = albums;
                    this.isLoading = false;
                }),
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
            this.toastService.showSuccess('Album removed from library');
        } catch (error) {
            this.toastService.showError('Failed to remove album from library');
        }
    }
}
