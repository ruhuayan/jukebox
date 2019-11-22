import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderComponent } from './uploader.component';
import { BytesPipe } from './bytesPipe';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [ CommonModule, HttpClientModule],
  declarations: [UploaderComponent, BytesPipe],
  exports: [UploaderComponent, BytesPipe]
})
export class UploaderModule { }
