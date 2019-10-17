import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardAnimateDirective } from './canimate.directive';
import { DraggableDirective } from './draggable.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [
      DraggableDirective,
      CardAnimateDirective,
    ],
    exports: [
      DraggableDirective,
      CardAnimateDirective,
    ],
    providers: []
})
export class AnimateModule {}
