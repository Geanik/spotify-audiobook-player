import { Component } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { debounceTime, distinctUntilChanged, Subject, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-album-search',
    imports: [FormsModule],
    templateUrl: './album-search.component.html',
    styleUrl: './album-search.component.scss',
})
export class AlbumSearchComponent {
    query = '';
    albums: any[] = [];
    private searchSubject = new Subject<string>();

    constructor(private spotifyService: SpotifyService) {
        this.setupSearch();
    }

    private setupSearch() {
        this.searchSubject
            .pipe(
                debounceTime(350),
                distinctUntilChanged(),
            )
            .subscribe((query) => {
                if (query) {
                    this.searchAlbums(query);
                } else {
                    this.albums = [];
                }
            });
    }

    onQueryChange(query: string) {
        this.searchSubject.next(query);
    }

    private searchAlbums(query: string) {
        this.spotifyService
            .searchAlbums(query)
            .pipe(
                tap((result: any) => {
                    this.albums = result.albums.items;
                }),
            )
            .subscribe();
    }
}
