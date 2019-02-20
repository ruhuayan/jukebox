import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelRightComponent } from './panel-right.component';

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [
      PanelRightComponent
    ],
    exports: [
      PanelRightComponent
    ],
    providers: []
})
export class PanelRightModule {}

