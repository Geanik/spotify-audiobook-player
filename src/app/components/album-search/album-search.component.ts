import { Component } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import {
    debounceTime,
    distinctUntilChanged,
    Observable,
    Subject,
    tap,
} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AlbumCardComponent } from '../album-card/album-card.component';
import { ToastService } from '../../services/toast.service';
import { AlbumCardSkeletonComponent } from '../album-card/album-card-skeleton/album-card-skeleton.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-album-search',
    imports: [FormsModule, AlbumCardComponent, AlbumCardSkeletonComponent],
    templateUrl: './album-search.component.html',
    styleUrl: './album-search.component.scss',
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
export class AlbumSearchComponent {
    isLoading = false;
    query = '';
    albums: any[] = [];
    private searchSubject = new Subject<string>();

    constructor(
        private spotifyService: SpotifyService,
        private toastService: ToastService,
    ) {
        this.setupSearch();
    }

    private setupSearch() {
        this.searchSubject
            .pipe(debounceTime(350), distinctUntilChanged())
            .subscribe((query) => {
                if (query) {
                    this.isLoading = true;
                    this.searchAlbums(query)
                        .pipe(tap(() => (this.isLoading = false)))
                        .subscribe();
                } else {
                    this.albums = [];
                }
            });
    }

    onQueryChange(query: string) {
        this.searchSubject.next(query);
    }

    private searchAlbums(query: string): Observable<void> {
        return this.spotifyService.searchAlbums(query).pipe(
            tap((result: any) => {
                this.albums = result.albums.items;
            }),
            this.toastService.withErrorToast('Failed to search albums'),
        );
    }

    onAlbumClick(albumId: string) {
        this.spotifyService
            .playAlbum(albumId)
            .pipe(this.toastService.withErrorToast('Failed to play album'))
            .subscribe();
    }
}
