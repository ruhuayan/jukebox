import { Card, Face, Suit } from './card.model';

export class Deck {
    private cards: Card[] = [];
    private numOfDeck: number;
    cardBackImg: string;
    constructor(n: number = 1) {
      this.numOfDeck = n;
      this.createCards();
      this.cardBackImg = 'assets/svg-cards/Card_back.svg';
    }

    public getCards(): Card[] {
        return this.cards;
    }
    public reset(): void {
        this.cards = [];
        this.shuffle();
    }
    public shuffle(): void {
        if (this.cards.length === 0) {
            this.createCards();
        }
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    public loadCardImages() {
        const promises = []
        this.cards.forEach(card => {
            const promise = new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => { resolve(); };
                img.src = card.imgUrl;
            });
            promises.push(promise);
        });
        return Promise.all(promises);
    }

    public dealOneCard(): Card {
        if (this.cards.length)
            return this.cards.pop();
        else return null;
    }

    private createCards(): void {
      for (let i = 0; i < this.numOfDeck; i++) {
        for (const face in Face){
          for (const suit in Suit){
              if(!Number(face) && !Number(suit)) this.cards.push(new Card(Face[face], Suit[suit]));
          }
        }
      }

    }
}
