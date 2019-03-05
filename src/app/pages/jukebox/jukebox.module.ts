import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JukeboxComponent } from './jukebox.component';
import { RouterModule } from '@angular/router';
import { PanelRightModule } from '../panel-right.module';
import { BeatService } from './beat.service';
import { JukeService } from './jukebox.service';
import { AppFileUploadInput } from './file-upload-input.directive';
import { BytesPipe } from './bytesPipe';

@NgModule({
imports: [
  CommonModule, PanelRightModule,
  RouterModule.forChild([
    {
      path: '',
      component: JukeboxComponent
    }
  ])
],
providers: [BeatService, JukeService],
declarations: [JukeboxComponent, AppFileUploadInput, BytesPipe]
})
export class JukeboxModule {}
