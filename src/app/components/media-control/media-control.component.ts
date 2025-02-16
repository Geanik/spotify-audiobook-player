import { Component } from '@angular/core';
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { SpotifyService } from '../../services/spotify.service';
import { map } from 'rxjs';

@Component({
    selector: 'app-media-control',
    templateUrl: './media-control.component.html',
    imports: [NgClass, NgStyle, AsyncPipe],
    styleUrls: ['./media-control.component.css'],
})
export class MediaControlComponent {
    isPlaying$ = this.spotifyService.isPlaying$;
    currentTrack$ = this.spotifyService.currentTrack$.pipe(
        map((track) =>
            track
                ? {
                      albumCoverUrl: track.album.images[0].url,
                      trackTitle: track.name,
                      trackArtist: track.artists[0].name,
                  }
                : null,
        ),
    );

    constructor(private spotifyService: SpotifyService) {}

    togglePlay() {
        this.spotifyService.togglePlay();
    }

    prev() {
        this.spotifyService.skipToPrevTrack();
    }

    next() {
        this.spotifyService.skipToNextTrack();
    }
}
