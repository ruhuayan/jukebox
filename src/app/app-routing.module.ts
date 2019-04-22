import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {path: '', redirectTo: 'igame', pathMatch: 'full'},
  {
    path: 'jukebox',
    loadChildren: './pages/jukebox/jukebox.module#JukeboxModule'
  }, {
    path: 'igame',
    loadChildren: './pages/imagegame/imagegame.module#ImagegameModule'
  }, {
		path: 'points',
    loadChildren: './pages/points/points.module#PointsModule'
  }, {
		path: 'blackjack',
    loadChildren: './pages/blackjack/blackjack.module#BlackjackModule'
  }, {
    path: 'solitaire',
    loadChildren: './pages/solitaire/solitaire.module#SolitaireModule'
  },{
    path: 'balls',
    loadChildren: './pages/ball/ball.module#BallModule'
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
