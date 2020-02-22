import { Component, OnInit, OnDestroy } from '@angular/core';
import { Card } from '../../models/card.model';
import { Deck } from '../../models/deck.model';
import { Position } from '../../directives/position.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-points',
  templateUrl: './solitaire.component.html',
  styleUrls: ['./solitaire.component.scss']
})
export class SolitaireComponent implements OnInit {

  deck: Deck = new Deck(1);
  leftCards: Card[] = this.deck.getCards();
  // 0 - 6: 7 rows in main screen; 7 - 10: 4 rows on top right corner; 11 - top left (openedCards)
  cols = new Array(12);
  private groupedCards: Card[] = [];
  actions: Action[] = [];
  constructor(private titleService: Title) {
    this.titleService.setTitle('Solitaire - richyan.com');
    for (let i = 0; i < this.cols.length; i++) {
      this.cols[i] = new Array<Card>();
    }
   }
  ngOnInit() {
    if (!Deck.isLoaded) {
      this.deck.loadCardImages(() => {
        this.deck.shuffle();
        this.refresh();
      });
    } else {
      this.deck.shuffle();
      this.refresh();
    }
  }

  newGame() {
    this.deck.reset();
    this.refresh();
    this.leftCards = this.deck.getCards();
    this.actions = [];
  }
  undo() {
    if (this.actions.length > 0) {
      const action: Action = this.actions.pop();
      if (action.hover) {
        const len = action.from.length;
        if (len === 1) {
          action.from[len - 1].show = false;
        } else if (len > 1 && !action.from[len - 2].show) {
          action.from[len - 1].show = false;
        }
      }
      for (let i = 0; i < action.cards.length; i++) {
        action.to.pop();
        action.from.push(action.cards[i]);
      }
    }
  }
  private refresh(): void {

    for (let i = 0; i < 7; i++) {
        this.cols[i] = this.cols[i] ? new Array(i + 1) : [];
        for (let j = 0; j < i + 1; j++) {
          const card: Card = this.deck.dealOneCard();
            if (j === i) {
                card.show = true;
            }
            this.cols[i][j] = card;
        }
    }
    for (let i = 7; i < this.cols.length; i++) {
      this.cols[i] = [];
    }
  }

  open(): void {
    if (this.leftCards.length > 0) {
      const card: Card = this.leftCards.pop();
      card.show = true;
      this.cols[11].push(card);
      this.actions.push({from: this.leftCards, to: this.cols[11], cards: [card]});
    } else {
      while (this.cols[11].length > 0) {
        this.leftCards.push(this.cols[11].pop());
      }
      this.actions.push({from: this.cols[11], to: this.leftCards, cards: this.cols[11].slice(0)});
    }
  }
  onDragStart(fromZoneId: number, cardIndex: number) {
    this.groupedCards = [];
    if (this.cols[fromZoneId].length > cardIndex - 1) {
      for (let i = cardIndex + 1; i < this.cols[fromZoneId].length; i++) {
        this.cols[fromZoneId][i]['grouped'] = true;
        this.groupedCards.push(this.cols[fromZoneId][i]);
      }
    }
    if (this.groupedCards.length) {
      const card = this.cols[fromZoneId][cardIndex];
      card.grouped = true;
    }
  }

  onDragMove(position: Position, fromZoneId: number, cardIndex: number) {
    if (this.groupedCards.length) {
      // const position: Position = $event['position'];
      this.groupedCards.map(card => {
        card['position'] = position;
      });
    }
  }

  onDropped(toDropzoneId: number, fromZoneId: number, cardIndex: number) {
    // const toDropzoneId = $event['dropzoneId'];
    // can not drop multiple card on cols 7 - 10
    // if (toDropzoneId >= 7 && toDropzoneId <= 10 && this.groupedCards.length) {
    //     for (let i = 0; i < this.groupedCards.length; i++) {
    //       this.groupedCards[i]['grouped'] = false;
    //       this.groupedCards[i]['position'] = {x: 0, y: 0}; // cant remove
    //     }
    // }
    const card = this.cols[fromZoneId][cardIndex];
    if (toDropzoneId === -1) {
      card.grouped = false;
      this.groupedCards = [];
      return;
    }

    let numOfCard = 1;
    
    let action: Action;
    this.cols[toDropzoneId].push(card);
    if (this.groupedCards.length) {
        numOfCard = this.groupedCards.length;
        for (let i = 0; i < numOfCard; i++) {
          this.groupedCards[i]['grouped'] = false;
          this.groupedCards[i]['position'] = {x: 0, y: 0}; // cant remove
          this.cols[toDropzoneId].push(this.groupedCards[i]);
        }
      action = {from: this.cols[fromZoneId], to: this.cols[toDropzoneId], cards: [card, ...this.groupedCards]};
    } else {
      action = {from: this.cols[fromZoneId], to: this.cols[toDropzoneId], cards: [card]};
    }

    this.cols[fromZoneId].splice(cardIndex, numOfCard + 1);
    if (cardIndex > 0) {
      this.cols[fromZoneId][cardIndex - 1].show = true;
      action.hover = true;
    }
    this.actions.push(action);
    this.groupedCards = [];console.log('end',this.groupedCards)
    // if (this.gameFinished()) {
    //   setTimeout(() => window.alert('You Won !'), 300);
    // }
  }

  private gameFinished(): boolean {
    const cards = this.cols.concat(this.leftCards).reduce((acc, curr) => acc.concat(curr), []);
    for (const card of cards) {
      if (!card.show) {
        return false;
      }
    }
    return true;
  }
}

interface Action {
  from: Card[];
  to: Card[];
  cards: Card[];
  hover?: boolean;
}
