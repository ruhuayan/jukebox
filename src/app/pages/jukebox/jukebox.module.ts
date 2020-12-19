import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JukeboxComponent } from './jukebox.component';
import { RouterModule } from '@angular/router';
import { PanelRightModule } from '../panel-right.module';
import { JukeService } from './model/jukebox.service';
import { UploaderModule } from 'src/app/uploader/uploader.module';
import { StoreModule } from '@ngrx/store';
import { jukeboxReducer } from './state/jukebox.reducer';
import { EffectsModule } from '@ngrx/effects';
import { JukeboxEffect } from './state/jukebox.effect';
import { LoaderService } from './model/loader.service';

@NgModule({
  imports: [
    CommonModule, PanelRightModule, UploaderModule,
    RouterModule.forChild([
      {
        path: '',
        component: JukeboxComponent
      }
    ]),
    StoreModule.forRoot({ iJukeboxState: jukeboxReducer }),
    EffectsModule.forRoot([JukeboxEffect]),
  ],
  providers: [JukeService, LoaderService],
  declarations: [JukeboxComponent]
})
export class JukeboxModule { }
