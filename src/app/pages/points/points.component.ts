import { Component, OnInit, OnDestroy } from '@angular/core';
import { Card } from '../../card/models/card.model';
import { Deck } from '../../card/models/deck.model';
import { Title } from '@angular/platform-browser';
import { Calculator } from './calculator.model';
import { interval } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Component({
    selector: 'app-points',
    templateUrl: './points.component.html',
    styleUrls: ['./points.component.scss']
})
export class PointsComponent implements OnInit {

    dealedCards: Card[] = [];
    deck = new Deck();
    ondealing = false;
    solution: string;
    cardNumber = 4;

    constructor(private titleService: Title) {
    }
    ngOnInit() {
        this.titleService.setTitle('24 Point - richyan.com');
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

    refresh(): void {
        this.solution = null;
        this.ondealing = true;
        this.dealedCards = [];
        if (this.deck.getCards().length <= 4) {
            this.deck.shuffle();
        }

        interval(200).pipe(
            tap(i => {
                this.dealOneCard();
                if (i === this.cardNumber - 1) {
                    this.ondealing = false;
                }
            }),
            take(this.cardNumber)
        ).subscribe();
    }

    setCardNumber(num: number): void {
        this.cardNumber = +num;
        this.refresh();
    }
    findSolutions(): void {
        if (this.dealedCards.length < 2) {
            return;
        }
        if (this.solution === null) {
            const numbers = this.dealedCards.map((card) => card.value);
            if (typeof Worker !== 'undefined') {
                // Create a new
                const worker = new Worker(new URL('./points.worker', import.meta.url), { type: 'module' });
                worker.onmessage = ({ data }) => {
                    console.log(`return: ${data}`);
                    this.solution = data;
                };
                worker.postMessage(JSON.stringify(numbers));

            } else {
                // console.time('regular');
                const calculator = new Calculator(numbers);
                this.solution = calculator.getExp();
                // console.timeEnd('regular');
            }

        }
    }

    dealOneCard(): void {
        const card: Card = this.deck.dealOneCard();
        if (card) {
            this.dealedCards.push(card);
        }
    }
}
