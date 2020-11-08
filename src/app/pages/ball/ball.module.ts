import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelRightModule } from '../panel-right.module';
import { BallComponent } from './ball.component';
import { StoreModule } from '@ngrx/store';
import { ballReducer } from './state/ball.reducer';
import { EffectsModule } from '@ngrx/effects';
import { LocalStorageEffects } from './state/localStorage.effect';

@NgModule({
    imports: [
        CommonModule, PanelRightModule,
        RouterModule.forChild([
            {
                path: '',
                component: BallComponent
            }
        ]),
        StoreModule.forRoot({ iBallState: ballReducer }),
        EffectsModule.forRoot([LocalStorageEffects]),
    ],
    providers: [],
    declarations: [BallComponent]
})
export class BallModule { }
