import { Card, Suit } from '../models/card.model';
const suitArr = [[<string>Suit.CLUBS, <string>Suit.SPADES], [<string>Suit.DIAMONDS, <string>Suit.HEARTS]];

export class Dropzone {
    dropzone: HTMLElement;
    constructor(dropzone: HTMLElement) {
        this.dropzone = dropzone;
    }

    public isDroppable(card: Card): boolean {
        const homogeneous = this.dropzone.classList.contains('homogeneous');
        const cardValue = Number(this.dropzone.getAttribute('data-value'));
        const cardSuit = this.dropzone.getAttribute('data-suit');

        if (homogeneous) {
            // only one card 
            if (card['grouped']) {
                return false;
            }
            if (cardValue && cardSuit !== '0') {
                return cardSuit === <string>card.suit && card.value === cardValue + 1;
            } else if (card.value === 1) {
                return true;
            }
        } else {
            if (cardValue && cardSuit !== '0') {
                return (suitArr[0].indexOf(cardSuit) >= 0 && suitArr[1].indexOf(<string>card.suit) >= 0 ||
                    suitArr[1].indexOf(cardSuit) >= 0 && suitArr[0].indexOf(<string>card.suit) >= 0) &&
                    card.value + 1 === cardValue;
            } else if (card.value === 13) {
                return true;
            }
        }
        return false;
    }

    public entreZone(rect: ClientRect): boolean {
        const zone = this.dropzone.getBoundingClientRect();
        return rect.right > zone.left &&
            rect.left < zone.right &&
            rect.bottom > zone.top &&
            rect.top < zone.bottom;
    }

    public getId(): number {
        return Number(this.dropzone.getAttribute('data-index'));
    }
}
