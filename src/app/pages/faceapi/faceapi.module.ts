import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaceapiComponent } from './faceapi.component';
import { RouterModule } from '@angular/router';
import { AnimateModule } from '../../directives/animate.module';
import { PanelRightModule } from '../panel-right.module';

@NgModule({
imports: [
  CommonModule, AnimateModule, PanelRightModule,
  RouterModule.forChild([
    {
      path: '',
      component: FaceapiComponent
    }
  ])
],
providers: [],
declarations: [FaceapiComponent]
})
export class FaceapiModule {}
