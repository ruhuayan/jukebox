import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlackjackComponent } from './blackjack.component';
import { RouterModule } from '@angular/router';
import { PanelRightModule } from '../panel-right.module';
import { CardModule } from 'src/app/card/card.module';

@NgModule({
    imports: [
        CommonModule, CardModule, PanelRightModule,
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
