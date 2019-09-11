import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JukeboxComponent } from './jukebox.component';
import { RouterModule } from '@angular/router';
import { PanelRightModule } from '../panel-right.module';
import { BeatService } from './beat.service';
import { JukeService } from './jukebox.service';
import { UploaderModule } from 'src/app/uploader/uploader.module';


@NgModule({
imports: [
  CommonModule, PanelRightModule, UploaderModule,
  RouterModule.forChild([
    {
      path: '',
      component: JukeboxComponent
    }
  ])
],
providers: [BeatService, JukeService],
declarations: [JukeboxComponent]
})
export class JukeboxModule {}
