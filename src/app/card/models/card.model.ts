export enum Face {
    ACE = 'ace',
    TWO = 'two',
    THREE = 'three',
    FOUR = 'four',
    FIVE = 'five',
    SIX = 'six',
    SEVEN = 'seven',
    EIGHT = 'eight',
    NINE = 'nine',
    TEN = 'ten',
    JACK = 'jack',
    QUEEN = 'queen',
    KING = 'king'
}

export enum Suit {
    CLUBS = 'C',
    DIAMONDS = 'D',
    HEARTS = 'H',
    SPADES = 'S'
}

export class Card {

    face: string;
    suit: string;
    imgUrl: string;
    show: boolean;

    constructor(face: Face, suit: Suit) {
        this.face = face;
        this.suit = suit;
        this.show = true;
        this.imgUrl = `assets/svg-cards/cards.svg#card_${this.value}${this.suit}`;
    }
    get value(): number {
        switch (this.face) {
            case Face.ACE:
                return 1;
            case Face.TWO:
                return 2;
            case Face.THREE:
                return 3;
            case Face.FOUR:
                return 4;
            case Face.FIVE:
                return 5;
            case Face.SIX:
                return 6;
            case Face.SEVEN:
                return 7;
            case Face.EIGHT:
                return 8;
            case Face.NINE:
                return 9;
            case Face.TEN:
                return 10;
            case Face.JACK:
                return 11;
            case Face.QUEEN:
                return 12;
            default:
                return 13;
        }
    }
}

