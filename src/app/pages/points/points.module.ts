import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointsComponent } from './points.component';
import { RouterModule } from '@angular/router';
import { AnimateModule } from '../../directives/animate.module';
import { PanelRightModule } from '../panel-right.module';

@NgModule({
imports: [
  CommonModule, AnimateModule, PanelRightModule,
  RouterModule.forChild([
    {
      path: '',
      component: PointsComponent
    }
  ])
],
providers: [],
declarations: [PointsComponent]
})
export class PointsModule {}
