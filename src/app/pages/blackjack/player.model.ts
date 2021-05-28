import { Card } from '../../card/models/card.model';

export enum Status {
    ONDEALING = 0,
    STAND = 1,
    CANHIT = 2,
    PLAYER_BUSTED = 3,
    DEALER_BUSTED = 4,
    PLAYER_BLACKJACK = 5,
    DEALER_BLACKJACK = 6,
    FINISH = 7
}
export enum Role {
    DEALER = 0,
    PLAYER = 1
}

export class Player {
    cards: Card[];
    status: string;

    constructor() {
        this.cards = [];
    }
    empty(): void {
        this.cards = [];
        this.status = null;
    }

    get sum(): number {
        if (this.cards.length === 0) { return 0; }
        const nums = this.cards.map(card => card.value < 10 ? card.value : 10);
        const numsNotOne = nums.filter(v => v > 1);
        const numOnes = nums.filter(v => v === 1);

        let total = numsNotOne.reduce((acc, curr) => acc + curr, 0);
        if (numOnes.length > 0) {
            total = numOnes.reduce((acc, curr, i) => {
                if (acc + 11 > 21 - (numOnes.length - 1 - i)) {
                    return acc + 1;
                } else {
                    return acc + 11;
                }
            }, total);
        }
        return total;
    }
}
