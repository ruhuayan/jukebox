import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfComponent } from './pdf.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [PdfComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PdfComponent
      }
    ]),
  ]
})
export class PdfModule { }
