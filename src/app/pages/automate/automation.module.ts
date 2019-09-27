import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { AutomationComponent } from './automation.component';

@NgModule({
imports: [
  CommonModule, 
  RouterModule.forChild([
    {
      path: '',
      component: AutomationComponent
    }
  ])
],
providers: [],
declarations: [AutomationComponent]
})
export class AutomationModule {}
