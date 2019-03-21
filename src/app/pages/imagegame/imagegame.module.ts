import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagegameComponent } from './imagegame.component';
import { RouterModule } from '@angular/router';
import { PanelRightModule } from '../panel-right.module';
import { UploaderModule } from 'src/app/uploader/uploader.module';

@NgModule({
imports: [
  CommonModule, PanelRightModule, UploaderModule,
  RouterModule.forChild([
    {
      path: '',
      component: ImagegameComponent
    }
  ])
],
providers: [],
declarations: [ImagegameComponent]
})
export class ImagegameModule {}
