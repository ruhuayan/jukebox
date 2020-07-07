import { Directive, ElementRef, OnInit, Attribute, Input, HostBinding } from '@angular/core';
import { Position } from './models/position.model';
import { Card } from './models/card.model';
@Directive({
    selector: '[appCanimate]',
})
export class CardAnimateDirective implements OnInit {
    @Input('appCard') appCard: Card;
    @HostBinding('class.show') show = false;
    @HostBinding('class.card_init') card_init = true;
    constructor(
        private el: ElementRef,
        // private renderer: Renderer2,
        @Attribute('appCanimate') public fromId: string
    ) { }
    ngOnInit() {

        const cardBack = this.el.nativeElement.querySelector('.card_back');
        const cardFront = this.el.nativeElement.querySelector('.card_front');
        const initCard = document.querySelector(this.fromId);
        const initPos: Position = initCard ? this.getPosition(initCard) : { x: 0, y: 0 };
        const destPos: Position = this.getPosition(cardFront);

        cardBack.style.left = (initPos.x - destPos.x) + 'px';
        cardBack.style.top = (initPos.y - destPos.y) + 'px';

        // animation - move card
        setTimeout(() => {
            this.card_init = false;
            cardBack.style.left = '0px';
            cardBack.style.top = '0px';
            if (this.appCard.show) {
                // animation - turn card face up
                setTimeout(() => {
                    this.show = true;
                }, 100);
            }
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
