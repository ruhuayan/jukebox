import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointsComponent } from './points.component';
import { RouterModule } from '@angular/router';
import { CardModule } from '../../card/card.module';
import { PanelRightModule } from '../panel-right.module';

@NgModule({
    imports: [
        CommonModule, CardModule, PanelRightModule,
        RouterModule.forChild([
            {
                path: '',
                component: PointsComponent
            }
        ])
    ],
    providers: [],
    declarations: [PointsComponent]
})
export class PointsModule { }
