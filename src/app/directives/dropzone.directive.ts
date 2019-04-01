import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, OnInit, Output, Input, Renderer2 } from '@angular/core';
import { Card, Suit } from '../models/card.model';

const suitArr = [[Suit.CLUBS, Suit.SPADES], [Suit.DIAMONDS, Suit.HEARTS]];
@Directive({
  selector: '[appDropzone]'
})
export class DropzoneDirective implements OnInit {
  @HostBinding('class.appDropzone') appDropzone = true;
  @HostBinding('class.dropzone-activated') activated = false;
  @Input('appCardList') cardList: Card[];
  @Input('appCardHomogeneous') homogeneous: false;
  // @Output() getDropped = new EventEmitter<MouseEvent>();
  // @Output() remove = new EventEmitter<MouseEvent>();



  constructor(private el: ElementRef, private renderer: Renderer2) { }
  ngOnInit(): void {}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    event.preventDefault();
    this.activated = this.el.nativeElement.classList.contains('dropzone-activated');
    if (!this.activated) {
      return;
    }

    const cardValue = this.el.nativeElement.getAttribute('card-value').split('|');
    // let oppositeSuit = false;
    
    if (this.homogeneous) {
        if (this.cardList.length > 0) {
          const lastCard = this.cardList[this.cardList.length - 1];
          if (cardValue[1] == lastCard.suit && (+cardValue[0]) === lastCard.value + 1) {
            this.renderer.addClass(this.el.nativeElement, 'dropzone-droppable');
          }
        } else {  // list is empty
          if (cardValue[0] == 1) {
            this.renderer.addClass(this.el.nativeElement, 'dropzone-droppable');
          }
        }
    } else {
        if (this.cardList.length > 0) {
          const lastCard = this.cardList[this.cardList.length - 1];
          if (suitArr[0].indexOf(cardValue[1]) >= 0 && suitArr[1].indexOf(<any>lastCard.suit) >= 0 ||
              suitArr[1].indexOf(cardValue[1]) >= 0 && suitArr[0].indexOf(<any>lastCard.suit) >= 0
          ) {
            if (lastCard.value === (+cardValue[0]) + 1) {
              this.renderer.addClass(this.el.nativeElement, 'dropzone-droppable');
            }
          }
        } else {
          if (cardValue[0] == 13) {
            this.renderer.addClass(this.el.nativeElement, 'dropzone-droppable');
          }
        }
        
    }
    
    
  }

  // @HostListener('document:mouseUp', ['$event'])
  // onMouseUp(event: MouseEvent) {
  //   event.preventDefault();
  //   const dropped = this.el.nativeElement.classList.contains('dropzone-dropped');
  //   if (dropped) {
  //     this.getDropped.emit(event);
  //     this.renderer.removeClass(this.el.nativeElement, 'dropzone-dropped');
  //   }
  // }

}
