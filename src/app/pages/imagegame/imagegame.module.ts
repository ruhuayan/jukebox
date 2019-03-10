import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagegameComponent } from './imagegame.component';
import { RouterModule } from '@angular/router';
import { PanelRightModule } from '../panel-right.module';
// import { AppFileUploadInput } from '../jukebox/file-upload-input.directive';

@NgModule({
imports: [
  CommonModule, PanelRightModule,
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
