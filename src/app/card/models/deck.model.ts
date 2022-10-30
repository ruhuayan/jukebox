import { Card, Face, Suit } from './card.model';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

export class Deck {
  // all card images loaded
  static isLoaded: boolean;
  private cards: Card[] = [];
  private numOfDeck: number;
  private imgs: string[] = [
    'assets/svg-cards/Card_back.svg',
    'assets/svg-cards/cards.svg',
  ];

  /**
   * Constructor
   * @param n number of deck will be created
   */
  constructor(n: number = 1) {
    this.numOfDeck = n;
    this.createCards();
    // this.cardBackImg = 'assets/svg-cards/Card_back.svg';
  }
  /**
   * @return Card[] array of card in deck
   */
  public getCards(): Card[] {
    return this.cards;
  }

  /**
   * reset cards in deck
   */
  public reset(): Deck {
    this.cards = [];
    this.shuffle();
    return this;
  }

  /**
   * shuffle cards in Deck
   */
  public shuffle(): Deck {
    if (this.cards.length === 0) {
      this.createCards();
    }
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    return this;
  }

  /**
   * load card images in deck
   * @param callback function after load image
   */
  public loadCardImages(callback: Function): void {
    const promises = [];
    this.imgs.forEach((url) => {
      const promise = new Promise((resolve, _) => {
        const img = new Image();
        img.onload = () => {
          resolve(true);
        };
        img.src = url;
      });
      promises.push(promise);
    });
    forkJoin(promises)
      .pipe(take(1))
      .subscribe(() => {
        Deck.isLoaded = true;
        // subscription.unsubscribe();
        callback();
      });
  }
  /**
   * Deal one card - pop one card in deck
   */
  public dealOneCard(): Card {
    if (this.cards.length) {
      return this.cards.pop();
    } else {
      return null;
    }
  }

  /***
   * created deck
   */
  private createCards(): Deck {
    for (let i = 0; i < this.numOfDeck; i++) {
      for (const face of Object.values(Face)) {
        for (const suit of Object.values(Suit)) {
            this.cards.push(new Card(face, suit));
        }
      }
    }
    return this;
  }
}
