import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BallComponent } from './ball.component';
import { StoreModule } from '@ngrx/store';
import { ballReducer } from './state/ball.reducer';
import { EffectsModule } from '@ngrx/effects';
import { LocalStorageEffects } from './state/localStorage.effect';
import { PanelRightComponent } from '../panel-right.component';

@NgModule({
  imports: [
    CommonModule,
    PanelRightComponent,
    RouterModule.forChild([
      {
        path: '',
        component: BallComponent,
      },
    ]),
    StoreModule.forRoot(
      { iBallState: ballReducer },
      {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
        },
      }
    ),
    EffectsModule.forRoot([LocalStorageEffects]),
  ],
  providers: [],
  declarations: [BallComponent],
})
export class BallModule {}
