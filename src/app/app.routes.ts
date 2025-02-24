import { Routes } from '@angular/router';
import { AlbumSearchComponent } from './components/album-search/album-search.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './auth-guard.service';

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
        canActivate: [AuthGuardService],
    },
    {
        path: 'search',
        component: AlbumSearchComponent,
        title: 'Search',
        canActivate: [AuthGuardService],
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
    },
];
