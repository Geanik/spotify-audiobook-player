import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AudiobookPlayerStorage {
    albums: StorageAlbum[];
}

export interface StorageAlbum {
    id: string;
    lastPlayedTrack: string;
}

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private storageKey = 'audiobookPlayer';
    private albumIdsSubject: BehaviorSubject<string[]> = new BehaviorSubject<
        string[]
    >(this.getSavedAlbumIdsFromStorage());

    constructor(private toastService: ToastService) {}

    saveLastPlayedTrack(albumId: string, trackId: string) {
        const storage = this.getStorage();
        const album = storage.albums.find((album) => album.id === albumId);

        if (album) {
            album.lastPlayedTrack = trackId;
        } else {
            storage.albums.push({ id: albumId, lastPlayedTrack: trackId });
            this.toastService.showSuccess('Added album to library');
        }

        this.saveStorageAndUpdateSubject(storage);
    }

    getLastPlayedTrack(albumId: string): string | null {
        const storage = this.getStorage();
        const album = storage.albums.find((album) => album.id === albumId);
        return album ? album.lastPlayedTrack : null;
    }

    getSavedAlbumIds(): Observable<string[]> {
        return this.albumIdsSubject.asObservable();
    }

    removeAlbum(albumId: string): void {
        const storage = this.getStorage();
        storage.albums = storage.albums.filter((album) => album.id !== albumId);
        this.saveStorageAndUpdateSubject(storage);
    }

    private getStorage(): AudiobookPlayerStorage {
        const storage = localStorage.getItem(this.storageKey);
        return storage ? JSON.parse(storage) : { albums: [] };
    }

    private saveStorageAndUpdateSubject(storage: AudiobookPlayerStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(storage));
        this.albumIdsSubject.next(this.getSavedAlbumIdsFromStorage());
    }

    private getSavedAlbumIdsFromStorage(): string[] {
        const storage = this.getStorage();
        return storage.albums.map((album) => album.id);
    }
}
