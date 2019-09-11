import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardAnimateDirective } from './card-animate.directive';
import { DraggableDirective } from './draggable.directive';
import { DropzoneDirective } from './dropzone.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [
    DraggableDirective,
		CardAnimateDirective,
		DropzoneDirective
	],
	exports: [
		DraggableDirective,
		CardAnimateDirective,
		DropzoneDirective
	],
	providers: []
})
export class AnimateModule {}
