import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelRightModule } from '../panel-right.module';
import { BallComponent } from './ball.component';

@NgModule({
  imports: [
    CommonModule, PanelRightModule,
    RouterModule.forChild([
      {
        path: '',
        component: BallComponent
      }
    ])
  ],
  providers: [],
  declarations: [BallComponent]
})
export class BallModule { }
