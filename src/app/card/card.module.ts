import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardAnimateDirective } from './canimate.directive';
import { DraggableDirective } from './draggable.directive';
import { CardComponent } from './card.component';

@NgModule({
    imports: [CommonModule],
    declarations: [
        DraggableDirective,
        CardAnimateDirective,
        CardComponent
    ],
    exports: [
        DraggableDirective,
        CardAnimateDirective,
        CardComponent
    ],
    providers: []
})
export class CardModule { }
