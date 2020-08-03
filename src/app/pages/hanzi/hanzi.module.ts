import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelRightModule } from '../panel-right.module';
import { HanziComponent } from './hanzi.component';
import { WritingPadComponent } from './writing-pad.component';
import { IndexedDbService } from './lib/indexedDb.service';

@NgModule({
    declarations: [HanziComponent, WritingPadComponent],
    providers: [IndexedDbService],
    imports: [
        CommonModule, PanelRightModule, 
        RouterModule.forChild([
            {
                path: '',
                component: HanziComponent
            }
        ])
    ]
})
export class HanziModule { }
