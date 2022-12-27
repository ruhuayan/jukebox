import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: 'igame', pathMatch: 'full' },
    {
        path: 'igame',
        loadComponent: () => import('./pages/imagegame/imagegame.component').then(m => m.ImagegameComponent)
    }, {
        path: 'points',
        loadComponent: () => import('./pages/points/points.component').then(m => m.PointsComponent)
    }, {
        path: 'blackjack',
        loadComponent: () => import('./pages/blackjack/blackjack.component').then(m => m.BlackjackComponent)
    }, {
        path: 'solitaire',
        loadComponent: () => import('./pages/solitaire/solitaire.component').then(m => m.SolitaireComponent)
    }, {
        path: 'balls',
        loadChildren: () => import('./pages/ball/ball.module').then(m => m.BallModule)
    }, {
        path: 'faceapi',
        loadComponent: () => import('./pages/faceapi/faceapi.component').then(m => m.FaceapiComponent)
    }, {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    }, {
        path: '404',
        component: NotFoundComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
