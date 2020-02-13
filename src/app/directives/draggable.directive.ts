import { Directive, EventEmitter, HostBinding, HostListener, Output, Input, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Position } from './position.model';
import { Card } from '../models/card.model';
import { Dropzone } from './dropzone.model';

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
  @Input('appDraggingCard') draggingCard: Card;

  @Output() dragStart = new EventEmitter();
  @Output() dragMove = new EventEmitter<Position>();
  @Output() dropped = new EventEmitter<number>();

  private position: Position = {x: 0, y: 0};
  private draggingStartPosition: Position;
  private dropzones: [HTMLElement];
  private droppableDropzone: Dropzone;

  constructor(private sanitizer: DomSanitizer, private el: ElementRef) {
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onStart(event: any) {
    event.preventDefault();
    if (!this.draggingCard.show) {
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
    event.preventDefault();
    if (!this.dragging && !this.draggingCard['grouped']) {
      return;
    }
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
      this.position = this.draggingCard['position'];
    }
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onEnd(event: any) {

    // document:touchend cause other buttons malfuntion
    // if $this not dragging, return to regular click event
    if (!this.dragging && !this.draggingCard['grouped']) {
      return;
    }
    event.preventDefault();
    this.droppableDropzone = this.getDroppableZone();
    if (this.droppableDropzone) {
      this.dropped.emit(this.droppableDropzone.getId());
    }

    this.position = {x: 0, y: 0};
    this.draggingCard['grouped'] = false;
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
          dropzone.isDroppable(this.draggingCard)) {
          return dropzone;
      }
    }
    return null;
  }

}
