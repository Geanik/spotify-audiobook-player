import { Component } from '@angular/core';
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { SpotifyService } from '../../services/spotify.service';
import { map, tap } from 'rxjs';

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

    constructor(private spotifyService: SpotifyService) {
        this.isPlaying$
            .pipe(
                tap((isPlaying) => {
                    console.log('Is Playing:', isPlaying);
                }),
            )
            .subscribe();
    }

    togglePlay() {
        console.log('Toggle Play');
        this.spotifyService.togglePlay();
    }

    prev() {
        console.log('Previous track');
        this.spotifyService.skipToPrevTrack();
    }

    next() {
        console.log('Next track');
        this.spotifyService.skipToNextTrack();
    }
}
