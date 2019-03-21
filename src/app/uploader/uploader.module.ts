import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderComponent } from './uploader.component';
import { BytesPipe } from './bytesPipe';

@NgModule({
  imports: [ CommonModule],
  declarations: [UploaderComponent, BytesPipe],
  exports: [UploaderComponent, BytesPipe]
})
export class UploaderModule { }
