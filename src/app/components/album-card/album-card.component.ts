import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Album } from '@spotify/web-api-ts-sdk';

@Component({
    selector: 'app-album-card',
    imports: [],
    templateUrl: './album-card.component.html',
    styleUrl: './album-card.component.scss',
})
export class AlbumCardComponent {
    @Input() album!: Album;
    @Output() albumClicked = new EventEmitter<string>();

    onAlbumClick() {
        this.albumClicked.emit(this.album.id);
    }
}
