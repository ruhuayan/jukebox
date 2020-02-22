import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlackjackComponent } from './blackjack.component';
import { RouterModule } from '@angular/router';
import { AnimateModule } from '../../directives/animate.module';
import { PanelRightModule } from '../panel-right.module';

@NgModule({
    imports: [
        CommonModule, AnimateModule, PanelRightModule,
        RouterModule.forChild([
            {
                path: '',
                component: BlackjackComponent
            }
        ])
    ],
    providers: [],
    declarations: [BlackjackComponent]
})
export class BlackjackModule { }
