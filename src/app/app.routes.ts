import { Routes } from '@angular/router';
import { AlbumSearchComponent } from './components/album-search/album-search.component';

export const routes: Routes = [
    {
        path: 'search',
        component: AlbumSearchComponent,
        title: 'Search Albums',
    },
];
