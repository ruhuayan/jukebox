import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {path: '', redirectTo: 'igame', pathMatch: 'full'},
  {
    path: 'jukebox',
    loadChildren: './pages/jukebox/jukebox.module#JukeboxModule'
    // loadChildren: () => import('./pages/jukebox/jukebox.module').then(m => m.JukeboxModule)
  }, {
    path: 'igame',
    loadChildren: './pages/imagegame/imagegame.module#ImagegameModule'
    // loadChildren: () => import('./pages/imagegame/imagegame.module').then(m => m.ImagegameModule)
  }, {
		path: 'points',
    loadChildren: './pages/points/points.module#PointsModule'
    // loadChildren: () => import('./pages/points/points.module').then(m => m.PointsModule)
  }, {
		path: 'blackjack',
    loadChildren: './pages/blackjack/blackjack.module#BlackjackModule'
    // loadChildren: () => import('./pages/blackjack/blackjack.module').then(m => m.BlackjackModule)
  }, {
    path: 'solitaire',
    loadChildren: './pages/solitaire/solitaire.module#SolitaireModule'
    // loadChildren: () => import('./pages/solitaire/solitaire.module').then(m => m.SolitaireModule)
  },{
    path: 'balls',
    loadChildren: './pages/ball/ball.module#BallModule'
    // loadChildren: () => import('./pages/ball/ball.module').then(m => m.BallModule)
  },{
    path: 'faceapi',
    loadChildren: './pages/faceapi/faceapi.module#FaceapiModule'
    // loadChildren: () => import('./pages/faceapi/faceapi.module').then(m => m.FaceapiModule)
  },{
    path: 'automation',
    loadChildren: './pages/automate/automation.module#AutomationModule'
    // loadChildren: () => import('./pages/automate/automation.module').then(m => m.AutomationModule)
  },{
		path: '**',
		redirectTo: '404',
		pathMatch: 'full'
	}, {
    path: '404',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
