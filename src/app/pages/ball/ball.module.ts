import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelRightModule } from '../panel-right.module';
import { BallComponent } from './ball.component';
import { StoreModule } from '@ngrx/store';
import { ballReducer } from './ball.reducer';

@NgModule({
  imports: [
    CommonModule, PanelRightModule,
    RouterModule.forChild([
      {
        path: '',
        component: BallComponent
      }
    ]), 
    StoreModule.forRoot({ balls: ballReducer })
  ],
  providers: [],
  declarations: [BallComponent]
})
export class BallModule { }
