import { Directive,  ElementRef, OnInit, Renderer2, Attribute } from '@angular/core';
import { Position } from './position.model';
@Directive({
  selector: '[appCanimate]',
})
export class CardAnimateDirective implements OnInit {

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        @Attribute('appCanimate') public fromId: string
    ) { }
    ngOnInit() {

      const cardBack = this.el.nativeElement.querySelector('.card__back');
      const cardFront = this.el.nativeElement.querySelector('.card__front');
      const initCard = document.querySelector(this.fromId);
      const initPos: Position = initCard ? this.getPosition(initCard) : {x: 0, y: 0};
      const destPos: Position = this.getPosition(cardFront);
      this.renderer.addClass(cardBack, 'card__init');
      cardBack.style.left = (initPos.x - destPos.x) + 'px';
      cardBack.style.top = (initPos.y - destPos.y) + 'px';
      setTimeout(() => {
          this.renderer.removeClass(cardBack, 'card__init');
          cardBack.style.left =  '0px';
          cardBack.style.top = '0px';
          setTimeout(() => {
            this.renderer.addClass(this.el.nativeElement, 'hover');
          }, 100);
      }, 50);
    }

    getPosition(el): Position {
      let xPos = 0;
      let yPos = 0;

      while (el) {
        if (el.tagName === 'BODY') {
          // deal with browser quirks with body/window/document and page scroll
          const xScroll = el.scrollLeft || document.documentElement.scrollLeft;
          const yScroll = el.scrollTop || document.documentElement.scrollTop;

          xPos += (el.offsetLeft - xScroll + el.clientLeft);
          yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
          // for all other non-BODY elements
          xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
          yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }
        el = el.offsetParent;
      }
      return {
        x: xPos,
        y: yPos
      };
    }
}
