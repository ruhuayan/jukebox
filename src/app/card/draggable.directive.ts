import { Directive, EventEmitter, HostBinding, HostListener, Output, Input, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Position } from './models/position.model';
import { Card } from './models/card.model';
import { Dropzone } from './models/dropzone.model';

@Directive({
    selector: '[appDraggable]'
})
export class DraggableDirective {
    @HostBinding('style.transform') get transform(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(
            `translateX(${this.position.x}px) translateY(${this.position.y}px)`
        );
    }

    @HostBinding('class.dragging') dragging = false;
    @Input('appCard') appCard: Card;
    @Input('appDragDisabled') dragDisabled = false;
    @Output() dragStart = new EventEmitter();
    @Output() dragMove = new EventEmitter<Position>();
    @Output() dropped = new EventEmitter<number>();

    private position: Position = { x: 0, y: 0 };
    private draggingStartPosition: Position;
    private dropzones: [HTMLElement];
    private droppableDropzone: Dropzone;

    constructor(private sanitizer: DomSanitizer, private el: ElementRef) {
    }

    @HostListener('mousedown', ['$event'])
    @HostListener('touchstart', ['$event'])
    onStart(event: any) {
        event.preventDefault();
        if (!this.appCard.show || this.dragDisabled) {
            return;
        }
        this.dragging = true;
        if (event.touches) {
            this.draggingStartPosition = {
                x: event['touches'][0]['clientX'] - this.position.x,
                y: event['touches'][0]['clientY'] - this.position.y
            };
        } else {
            this.draggingStartPosition = {
                x: event.clientX - this.position.x,
                y: event.clientY - this.position.y
            };
        }
        this.dragStart.emit();
    }

    @HostListener('document:mousemove', ['$event'])
    @HostListener('document:touchmove', ['$event'])
    onMove(event: any) {

        if (!this.dragging && !this.appCard['grouped']) {
            return;
        }
        event.preventDefault();
        if (this.dragging) {
            if (event.touches) {
                this.position = {
                    x: event['touches'][0]['clientX'] - this.draggingStartPosition.x,
                    y: event['touches'][0]['clientY'] - this.draggingStartPosition.y
                };
            } else {
                this.position = {
                    x: event.clientX - this.draggingStartPosition.x,
                    y: event.clientY - this.draggingStartPosition.y
                };
            }
            // this.droppableDropzone = this.getDroppableZone();
            this.dragMove.emit(this.position);
        } else {
            this.position = this.appCard['position'];
        }
    }

    @HostListener('document:mouseup', ['$event'])
    @HostListener('document:touchend', ['$event'])
    onEnd(event: any) {

        // document:touchend cause other buttons malfuntion
        // if $this not dragging, return to regular click event
        if (!this.dragging && !this.appCard['grouped']) {
            return;
        }
        event.preventDefault();
        this.droppableDropzone = this.getDroppableZone();
        if (this.droppableDropzone) {
            this.dropped.emit(this.droppableDropzone.getId());
        } else {
            this.dropped.emit(-1);
        }

        this.position = { x: 0, y: 0 };
        this.appCard['grouped'] = false;
        this.dragging = false;
    }

    private getDroppableZone(): Dropzone {
        if (!this.dropzones) {
            this.dropzones = [].slice.call(document.querySelectorAll('.appDropzone'));
        }
        const rect = this.el.nativeElement.getBoundingClientRect();
        for (let i = 0; i < this.dropzones.length; i++) {
            if (this.dropzones[i].contains(this.el.nativeElement)) {
                continue;
            }
            const dropzone = new Dropzone(this.dropzones[i]);
            if (dropzone.entreZone(rect) &&
                dropzone.isDroppable(this.appCard)) {
                return dropzone;
            }
        }
        return null;
    }

}
