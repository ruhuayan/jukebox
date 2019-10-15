import { Directive, EventEmitter, HostBinding, HostListener, Output, Input, Renderer2, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Position } from './position.model';
import { Card, Suit } from '../models/card.model';
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
  @Input('appDraggingCard') card: Card;

  @Output() dragStart = new EventEmitter();
  @Output() dragMove = new EventEmitter<Position>();
  @Output() dropped = new EventEmitter<number>();

  private position: Position = {x: 0, y: 0};
  private draggingStartPosition: Position;
  private dropzones: [HTMLElement];
  private droppableDropzone: Dropzone;

  constructor(private sanitizer: DomSanitizer, private el: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onStart(event: any) {
    event.preventDefault();
    if (!this.card.show) {
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
  @HostListener('touchmove', ['$event'])
  onMove(event: any) {
    event.preventDefault();
    if (!this.dragging && !this.card['grouped']) {
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
      this.droppableDropzone = this.getDroppableZone();
      this.dragMove.emit(this.position);
    } else {
      this.position = this.card['position'];
    }

  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('touchend', ['$event'])
  onEnd(event: any) {
    event.preventDefault();
    if (!this.dragging && !this.card['grouped']) {
      return;
    }

    if (this.droppableDropzone && this.droppableDropzone.entreZone(this.el.nativeElement.getBoundingClientRect())
      ) {
      this.dropped.emit(this.droppableDropzone.getId());
    }

    this.position = {x: 0, y: 0};
    this.card['grouped'] = false;
    this.dragging = false;
  }

  private getDroppableZone(): Dropzone {
    if (!this.dropzones) {
      this.dropzones = [].slice.call(document.querySelectorAll('.appDropzone'));
    }
    for (let i = 0; i < this.dropzones.length; i++) {
      if (this.dropzones[i].contains(this.el.nativeElement)) {
        continue;
      }
      const dropzone = new Dropzone(this.dropzones[i]);
      if (dropzone.entreZone(this.el.nativeElement.getBoundingClientRect()) &&
          dropzone.isDroppable(this.card)) {
          return dropzone;
      }
    }
    return null;
  }

}
