import { Component, OnInit } from '@angular/core';
import { Card } from '../../card/models/card.model';
import { Deck } from '../../card/models/deck.model';
import { Title } from '@angular/platform-browser';
import { Status, Role, Player } from './player.model';
import { interval } from 'rxjs';
import { take, tap } from 'rxjs/operators';
@Component({
    selector: 'app-blackjack',
    templateUrl: './blackjack.component.html',
    styleUrls: ['./blackjack.component.scss']
})
export class BlackjackComponent implements OnInit {

    deck = new Deck(3);
    status = Status.ONDEALING;
    player = new Player();
    dealer = new Player();
    scores = 0;
    showHint = false;
    probabilities: object = { player_busted: 0, player_win: 0, dealer_busted: 0 };
    prob_player = 0;
    prob_dealer: number = null;

    constructor(private titleService: Title) {
        this.titleService.setTitle('Blackjack - richyan.com');
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

    private refresh(): void {
        if (this.deck.getCards().length < 10) {
            this.deck.reset();
        }

        interval(200).pipe(
            tap(i => {
                this.dealOneCard(i % 2); console.log(i)
                if (i === 3) {
                    this.updateStatus(Role.PLAYER);
                }
            }),
            take(4)
        ).subscribe();
    }

    private dealOneCard(role: number): void {
        const card: Card = this.deck.dealOneCard();
        if (card) {
            if (role === Role.DEALER) {
                card.show = this.dealer.cards.length === 0 ? false : true;
                this.dealer.cards.push(card);
            } else {
                this.player.cards.push(card);
            }
        }
    }

    private updateStatus(role: number) {

        if (role === Role.DEALER) {  // dealer
            this.dealer.cards[0].show = true;
            const total = this.dealer.sum;

            if (total < 21) {

                interval(500).pipe(
                    take(1),
                    tap(_ => this.dealer.status = total + '')
                ).subscribe();

                this.status = Status.STAND;

                if (total > this.player.sum) {
                    this.scores -= 1;
                    this.status = Status.FINISH;
                    this.reset();
                } else if (total === this.player.sum) {
                    const percent = this.CalGoBusted(total);
                    if (percent > 50) {
                        this.status = Status.FINISH;
                        this.reset();
                    } else {
                        this.stand(1);
                    }
                }
            } else if (total > 21) {
                this.status = Status.DEALER_BUSTED;
                interval(500).pipe(
                    take(1),
                    tap(_ => {
                        this.dealer.status = 'Butsted';
                        this.scores += 1;
                        this.reset();
                    })
                ).subscribe();
            } else {
                this.status = Status.DEALER_BLACKJACK;
                this.dealer.status = 'Blackjack';
                if (this.player.sum !== 21) {
                    this.scores -= 1;
                }
                this.reset();
            }

        } else {  // player
            const total = this.player.sum;

            if (total < 21) {
                this.status = Status.CANHIT;
                interval(500).pipe(
                    take(1),
                    tap(_ => {
                        this.calProbalities();
                        this.player.status = total + '';
                    })
                ).subscribe();
            } else if (total > 21) {
                this.status = Status.PLAYER_BUSTED;
                interval(500).pipe(
                    take(1),
                    tap(_ => {
                        this.player.status = 'Busted';
                        this.scores -= 1;
                        this.reset();
                    })
                ).subscribe();
            } else {
                this.status = Status.PLAYER_BLACKJACK;
                interval(500).pipe(
                    take(1),
                    tap(_ => {
                        this.player.status = 'Blackjack';
                        this.stand();
                    })
                ).subscribe();
            }
        }

    }

    hit(): void {
        this.dealOneCard(Role.PLAYER);
        this.updateStatus(Role.PLAYER);
    }

    stand(replay = 0): void {
        this.status = Status.STAND;
        this.dealer.cards[0].show = true;
        if (replay) {
            this.dealOneCard(Role.DEALER);
        }
        this.updateStatus(Role.DEALER);
        if (this.status === Status.STAND && this.dealer.cards.length <= 5) {

            interval(700).pipe(
                take(1),
                tap(_ => this.stand(1))
            ).subscribe();
        }
    }

    hint() {
        this.showHint = !this.showHint;
        this.calProbalities();
    }
    private calProbalities() {
        this.probabilities['player_busted'] = this.CalGoBusted(this.player.sum);
        this.probabilities['player_win'] = this.calPlayerLose(this.player.sum, this.dealer.cards[1].value);
    }
    private CalGoBusted(sum: number): number {
        const diff = 21 - sum;

        const numOfCard = this.deck.getCards().reduce((acc, curr) => {
            const value = curr.value > 10 ? 10 : curr.value;
            if (value > diff) {
                acc += 1;
            }
            return acc;
        }, 0);
        return this.roundToTwo(numOfCard / this.deck.getCards().length);
    }
    private calPlayerLose(sum_player: number, num_dealer: number): number {
        num_dealer = this.setOneToEleven(this.setCeilingToTen(num_dealer));
        if (num_dealer > sum_player) { return 100; }
        const diff = sum_player - num_dealer;
        const numOfCard = this.deck.getCards().reduce((acc, curr) => {
            const value = this.setOneToEleven(this.setCeilingToTen(curr.value));
            if (value > diff) {
                acc += 1;
            }
            return acc;
        }, 0);
        return this.roundToTwo(numOfCard / this.deck.getCards().length);
    }

    private reset(): void {
        this.showHint = false;
        interval(1500).pipe(
            take(1),
            tap(_ => {
                this.status = Status.ONDEALING;
                this.player.empty();
                this.dealer.empty();
                this.refresh();
            })
        ).subscribe();
    }
    private roundToTwo(num) {
        return (Math.round(num * 10000) / 100);
    }

    private setCeilingToTen(num: number): number {
        return num > 10 ? 10 : num;
    }

    private setOneToEleven(num: number): number {
        return num === 1 ? 11 : num;
    }
}
