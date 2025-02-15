import { Routes } from '@angular/router';
import { AlbumSearchComponent } from './components/album-search/album-search.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
    },
    {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
    },
    {
        path: 'search',
        component: AlbumSearchComponent,
        title: 'Search',
    },
];
