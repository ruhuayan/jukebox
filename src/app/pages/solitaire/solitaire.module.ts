import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolitaireComponent } from './solitaire.component';
import { RouterModule } from '@angular/router';
import { AnimateModule } from '../../directives/animate.module';

@NgModule({
imports: [
  CommonModule, AnimateModule, 
  RouterModule.forChild([
    {
      path: '',
      component: SolitaireComponent
    }
  ])
],
providers: [],
declarations: [SolitaireComponent]
})
export class SolitaireModule {}
