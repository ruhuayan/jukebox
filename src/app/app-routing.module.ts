import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: 'igame', pathMatch: 'full' },
    {
        path: 'jukebox',
        loadChildren: () => import('./pages/jukebox/jukebox.module').then(m => m.JukeboxModule)
    }, {
        path: 'igame',
        loadChildren: () => import('./pages/imagegame/imagegame.module').then(m => m.ImagegameModule)
    }, {
        path: 'hanzi',
        loadChildren: () => import('./pages/hanzi/hanzi.module').then(m => m.HanziModule)
    }, {
        path: 'points',
        loadChildren: () => import('./pages/points/points.module').then(m => m.PointsModule)
    }, {
        path: 'blackjack',
        loadChildren: () => import('./pages/blackjack/blackjack.module').then(m => m.BlackjackModule)
    }, {
        path: 'solitaire',
        loadChildren: () => import('./pages/solitaire/solitaire.module').then(m => m.SolitaireModule)
    }, {
        path: 'balls',
        loadChildren: () => import('./pages/ball/ball.module').then(m => m.BallModule)
    }, {
        path: 'faceapi',
        loadChildren: () => import('./pages/faceapi/faceapi.module').then(m => m.FaceapiModule)
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
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
