import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolitaireComponent } from './solitaire.component';
import { RouterModule } from '@angular/router';
import { CardModule } from 'src/app/card/card.module';

@NgModule({
    imports: [
        CommonModule, CardModule,
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
export class SolitaireModule { }
