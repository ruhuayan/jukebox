import { Component, OnInit, OnDestroy } from '@angular/core';
import { Card } from '../../card/models/card.model';
import { Deck } from '../../card/models/deck.model';
import { Position } from '../../card/models/position.model';
import { Title } from '@angular/platform-browser';

const OPEN_CARD_ZONE = 11, LEFT_CARD_ZONE = 12;

@Component({
    selector: 'app-points',
    templateUrl: './solitaire.component.html',
    styleUrls: ['./solitaire.component.scss']
})
export class SolitaireComponent implements OnInit {

    deck: Deck = new Deck(1);
    // 0 - 6: 7 rows in main screen; 7 - 10: 4 rows on top right corner; 11 - top left (openedCards); 12 - leftCards
    cols = new Array(13);
    format = 1;
    private formatCards: Card[] = [];
    private groupedCards: Card[] = [];
    actions: Action[] = [];
    constructor(private titleService: Title) {
        this.titleService.setTitle('Solitaire - richyan.com');
        for (let i = 0; i < 12; i++) {
            this.cols[i] = new Array<Card>();
        }
        this.cols[LEFT_CARD_ZONE] = this.deck.getCards();
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

    changeFormat(): void {
        this.format = this.format === 1 ? 3 : 1;
        if (this.actions.length > 0) {
            this.newGame();
        }
    }

    newGame() {
        this.deck.reset();
        this.refresh();
        this.cols[LEFT_CARD_ZONE] = this.deck.getCards();
        this.actions = [];
    }
    undo() {
        if (this.actions.length > 0) {
            const action: Action = this.actions.pop();
            const fromZone = this.cols[action.fromId];
            const toZone = this.cols[action.toId];

            if (action.cardShow) {
                const len = fromZone.length;
                if (len === 1) {
                    fromZone[len - 1].show = false;
                } else if (len > 1 && !fromZone[len - 2].show) {
                    fromZone[len - 1].show = false;
                }
            }
            if (this.format === 3 && action.toId === OPEN_CARD_ZONE && action.fromId === LEFT_CARD_ZONE) {
                for (let i = 0; i < action.cards.length; i++) {
                    delete action.cards[i]['format'];
                    const card = toZone.pop();
                    fromZone.push(card);
                }
                this.formatCards = [...this.getLastFormatCards(this.actions.length - 1)];

            } else {
                for (let i = 0; i < action.cards.length; i++) {
                    action.cards[i]['grouped'] = false;
                    toZone.pop();
                    fromZone.push(action.cards[i]);
                }
            }
        }
    }
    private refresh(): void {
        this.deck.getCards().forEach(card => card.show = false);
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
        this.cols[LEFT_CARD_ZONE] = this.deck.getCards();
    }

    open(): void {
        if (this.format === 3 && this.formatCards.length) {
            this.formatCards.forEach(card => delete card['formatId']);
            this.formatCards = [];
        }
        if (this.cols[LEFT_CARD_ZONE].length > 0) {
            if (this.format === 3) {
                for (let i = 0; i < this.format; i++) {
                    const card: Card = this.cols[LEFT_CARD_ZONE].pop();
                    if (card) {
                        card.show = true;
                        card['formatId'] = i + 1;
                        this.formatCards.push(card);
                        this.cols[OPEN_CARD_ZONE].push(card);
                    }
                }
                this.actions.push({ fromId: LEFT_CARD_ZONE, toId: OPEN_CARD_ZONE, cards: [...this.formatCards] });
            } else {
                const card: Card = this.cols[LEFT_CARD_ZONE].pop();
                card.show = true;
                this.cols[OPEN_CARD_ZONE].push(card);
                this.actions.push({ fromId: LEFT_CARD_ZONE, toId: OPEN_CARD_ZONE, cards: [card] });
            }
        } else {
            while (this.cols[OPEN_CARD_ZONE].length > 0) {
                this.cols[LEFT_CARD_ZONE].push(this.cols[OPEN_CARD_ZONE].pop());
            }
            this.actions.push({ fromId: OPEN_CARD_ZONE, toId: LEFT_CARD_ZONE, cards: [...this.cols[LEFT_CARD_ZONE]].reverse() });
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
                this.groupedCards[i]['position'] = { x: 0, y: 0 }; // cant remove
                this.cols[toDropzoneId].push(this.groupedCards[i]);
            }
            action = { fromId: fromZoneId, toId: toDropzoneId, cards: [card, ...this.groupedCards] };
        } else {
            if (fromZoneId === OPEN_CARD_ZONE) {
                this.formatCards.pop();
            }
            action = { fromId: fromZoneId, toId: toDropzoneId, cards: [card] };
        }

        this.cols[fromZoneId].splice(cardIndex, numOfCard + 1);
        if (cardIndex > 0) {
            this.cols[fromZoneId][cardIndex - 1].show = true;
            action.cardShow = true;
        }
        this.actions.push(action);
        this.groupedCards = [];
        // if (this.gameFinished()) {
        //   setTimeout(() => window.alert('You Won !'), 300);
        // }
    }

    private getLastFormatCards(actionId: number): Card[] {
        const action = this.actions[actionId];
        if (!action) { return []; }
        if (action.cards.length === 3 && action.toId === OPEN_CARD_ZONE && action.fromId === LEFT_CARD_ZONE) {
            return action.cards.map((card, i) => { card['formatId'] = i + 1; return card; });
        } else if (action.cards.length === 1) {
            return this.getLastFormatCards(actionId - 1);
        } else { return []; }
    }
    private gameFinished(): boolean {
        const cards = this.cols.concat(this.cols[LEFT_CARD_ZONE]).reduce((acc, curr) => acc.concat(curr), []);
        for (const card of cards) {
            if (!card.show) {
                return false;
            }
        }
        return true;
    }
}

interface Action {
    fromId: number;
    toId: number;
    cards: Card[];
    cardShow?: boolean;
}
