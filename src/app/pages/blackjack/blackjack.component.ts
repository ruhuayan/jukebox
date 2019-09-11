import { Component, OnInit } from '@angular/core';
import { Card } from '../../models/card.model';
import { Deck } from '../../models/deck.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.scss']
})
export class BlackjackComponent implements OnInit {
  deck = new Deck(3);
  status = Status.ONDEALING;
  player = new Player('player');
  dealer = new Player('dealer');
  scores = 0;
  showHint = false;
  probabilities: object = {player_busted: 0, player_win: 0, dealer_busted: 0};
  prob_player = 0;
  prob_dealer: number = null;
  constructor(private titleService: Title) {
    this.titleService.setTitle('Blackjack - Poker Game');
    document.body.classList.add('loading');
    this.deck.loadCardImages().then(() =>{
      document.body.classList.remove('loading');
      this.deck.shuffle();
      this.refresh();
    });
  }
  ngOnInit() {}
  private refresh(): void {
    if (this.deck.getCards().length < 10) {
      this.deck.reset();
    }
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.dealOneCard(i % 2);
        if (i === 3) {
          this.updateStatus(Role.PLAYER);
        }
      }, 200 * i);
    }
  }

  private dealOneCard(role: number): void {
    const card: Card = this.deck.dealOneCard();
    if (card) {
      if (role === Role.DEALER) {
        this.dealer.cards.push(card);
      } else {
        this.player.cards.push(card);
      }
    }
  }

  private updateStatus(role: number) {

    if (role === Role.DEALER) {  // dealer
        const total = this.dealer.getSum();

        if (total < 21) {
          setTimeout(() => {
            this.dealer.status = total + '';
          }, 500);

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
          setTimeout(() => {
            this.dealer.status = 'Butsted';
            this.scores += 1;
            this.reset();
          }, 500);
        } else {
          this.status = Status.DEALER_BLACKJACK;
          this.dealer.status = 'Blackjack';
          if (this.player.sum !== 21) {
            this.scores -= 1;
          }
          this.reset();
        }

    } else {  // player
        const total = this.player.getSum();

        if (total < 21) {
          this.status = Status.CANHIT;
          setTimeout(() => {
            this.calProbalities();
            this.player.status = total + '';
          }, 500);
        } else if (total > 21) {
          this.status = Status.PLAYER_BUSTED;
          setTimeout(() => {
            this.player.status = 'Busted';
            this.scores -= 1;
            this.reset();
          }, 500);
        } else {
          this.status = Status.PLAYER_BLACKJACK;
          setTimeout(() => {
            this.player.status = 'Blackjack';
            this.stand();
          }, 500);
        }
    }

  }

  hit(): void {
    this.dealOneCard(Role.PLAYER);
    this.updateStatus(Role.PLAYER);
  }

  stand(replay = 0): void {
    this.status = Status.STAND;
    if (replay) {
      this.dealOneCard(Role.DEALER);
    }
    this.updateStatus(Role.DEALER);
    if (this.status === Status.STAND) {
      setTimeout(() => {
        this.stand(1);
      }, 700);
    }
  }

  hint() {
    this.showHint = !this.showHint;
    this.calProbalities();
  }
  private calProbalities() {
    this.probabilities['player_busted'] = this.CalGoBusted(this.player.sum);
    this.probabilities['player_win']  = this.calPlayerLose(this.player.sum, this.dealer.cards[1].value);
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
    return this.roundToTwo(numOfCard / this.deck.getCards().length );
  }

  private reset(): void {
    this.showHint = false;
    setTimeout(() => {
      this.status = Status.ONDEALING;
      this.player.empty();
      this.dealer.empty();
      this.refresh();
    }, 1500);
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

class Player {
  name: string;
  cards: Card[];
  status: string;
  sum: number;
  constructor(name: string) {
    this.name = name;
    this.cards = [];
    this.sum = 0;
  }
  empty(): void {
    this.cards = [];
    this.status = null;
  }

  getSum(): number {
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
    return this.sum = total;
  }
}

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
