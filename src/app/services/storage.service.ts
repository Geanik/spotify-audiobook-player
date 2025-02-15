import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor() {}

    saveLastPlayedTrack(albumId: string, trackId: string) {
        localStorage.setItem(this.getLastPlayedTrackKey(albumId), trackId);
    }

    getLastPlayedTrack(albumId: string): string | null {
        return localStorage.getItem(this.getLastPlayedTrackKey(albumId));
    }

    getAllSavedAlbumIds(): string[] {
        const keys = Object.keys(localStorage);
        return keys
            .filter((key) => key.startsWith('lastPlayed.'))
            .map((key) => key.replace('lastPlayed.', ''));
    }

    private getLastPlayedTrackKey(albumId: string): string {
        return `lastPlayed.${albumId}`;
    }
}
