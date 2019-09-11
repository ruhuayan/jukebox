import { Directive, EventEmitter, HostBinding, HostListener, Output, Input, Renderer2, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Position } from './position.model';
import { Card } from '../models/card.model';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {
  @HostBinding('style.transform') get transform(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(
      `translateX(${this.position.x}px) translateY(${this.position.y}px)`
    );
  }
  // @HostBinding('class.draggable') draggable = true;
  @HostBinding('class.dragging') dragging = false;
  @Input('appDraggingCard') card: Card;

  @Output() dragStart = new EventEmitter<MouseEvent>();
  @Output() dragMove = new EventEmitter<MouseEvent>();
  // @Output() dragEnd = new EventEmitter<MouseEvent>();
  @Output() dropped = new EventEmitter<MouseEvent>();

  private position: Position = {x: 0, y: 0};
  private draggingStartPosition: Position;
  private dropzones: any;
  private droppableDropzone: any;

  constructor(private sanitizer: DomSanitizer, private el: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    if (!this.card.show) {
      return;
    }
    this.dragging = true;
    this.draggingStartPosition = {
      x: event.clientX - this.position.x,
      y: event.clientY - this.position.y
    };
    this.dragStart.emit(event);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    event.preventDefault();
    if (!this.dragging && !this.card['grouped']) {
      return;
    }
    if (this.dragging) {
      this.position = {
        x: event.clientX - this.draggingStartPosition.x,
        y: event.clientY - this.draggingStartPosition.y
      };
      event['position'] = this.position;
      this.notify(true);
      // this.renderer.setStyle(this.element.nativeElement, 'transform',
      // `translateX(${this.position.x}px) translateY(${this.position.y}px)`);
      this.dragMove.emit(event);
    } else {
      this.position = this.card['position'];
    }

  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    event.preventDefault();
    if (!this.dragging && !this.card['grouped']) {
      return;
    }

    if (this.droppableDropzone &&
      this.isEnterDropZone(this.el.nativeElement.getBoundingClientRect(), this.droppableDropzone.getBoundingClientRect())) {
      const index = this.droppableDropzone.getAttribute('data-index');
      event['dropzoneId'] = +index;
      this.dropped.emit(event);

    }

    this.position = {x: 0, y: 0};
    this.card['grouped'] = false;
    if (this.dragging) {
      this.notify(false);
      this.dragging = false;
      this.clearDroppable();
    }
  }
  private isEnterDropZone(rect: ClientRect, DropZone: ClientRect) {
    return rect.right > DropZone.left &&
      rect.left < DropZone.right &&
      rect.bottom > DropZone.top &&
      rect.top < DropZone.bottom;
  }

  private notify(draggingStart: boolean) {
    if (!this.dropzones) {
      this.dropzones = document.querySelectorAll('.appDropzone');
    }
    for (let i = 0; i < this.dropzones.length; i++) {
      if (this.dropzones[i].contains(this.el.nativeElement)) {
        continue;
      }
      this.renderer.removeClass(this.dropzones[i], 'dropzone-activated');
      if (draggingStart) {
        const enterDropZone = this.isEnterDropZone(this.el.nativeElement.getBoundingClientRect(), this.dropzones[i].getBoundingClientRect());
        if (enterDropZone) {
          this.renderer.addClass(this.dropzones[i], 'dropzone-activated');
          this.renderer.setAttribute(this.dropzones[i], 'card-value', `${this.card.value}|${this.card.suit}`);
          if (this.dropzones[i].classList.contains('dropzone-droppable')) {
            this.droppableDropzone = this.dropzones[i];
          }
        }
      }
    }
  }

  private clearDroppable(): void {
    for (let i = 0; i < this.dropzones.length; i++) {
      this.renderer.removeClass(this.dropzones[i], 'dropzone-droppable');
    }
  }

}
