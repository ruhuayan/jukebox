import { Component, OnInit, OnDestroy } from '@angular/core';
import { Card } from '../../models/card.model';
import { Deck } from '../../models/deck.model';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

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
  constructor(private titleService: Title ) {
  }
  ngOnInit() {
    this.titleService.setTitle('24 Point - richyan.com');
    if (!Deck.isLoaded()) {
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
    if (this.deck.getCards().length === 0) {
      // this.deck.shuffle();
    }
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.dealOneCard();
        if (this.dealedCards.length === 4) {
          this.ondealing = false;
        }
      }, 200 * i);
    }
  }
  findSolutions(): void {
    if (this.dealedCards.length !== 4) {
      return;
    }
    if (this.solution === null ) {
      this.solution = this.calculateExp();
    }
  }

  clickEvent(card: Card): void {
    // console.log(card.value);
  }
  dealOneCard(): void {
    const card: Card = this.deck.dealOneCard();
    if (card) {
      this.dealedCards.push(card);
    }
  }
  calculateExp(): string {
    const operations = ['+', '-', '*', '/'];
    const numbers = this.dealedCards.map((card) => card.value); // console.log(numbers);

    for (let i = 0; i < 4; i++) {
      const a = numbers[i];
      for (let j = 0; j < 4; j++) {
        if (i === j) continue;
        const b = numbers[j];
        for (let x = 0; x < 4; x++) {
            if (x === j || x === i) continue;
            const c = numbers[x];
            for (let y = 0; y < 4; y++) {
                if (y === x || y === j || y === i) continue;
                const d = numbers[y];
                for (let ta = 0; ta < 4; ta++) {
                        const m1 = operations[ta];
                        for (let tb = 0; tb < 4; tb++) {
                            const m2 = operations[tb];
                            for (let tc = 0; tc < 4; tc++) {
                                const m3 = operations[tc];
                                for (let n = 0; n < 11; n++) {
                                    const exp = this.getExp([a, b, c, d], [m1, m2, m3], n);

                                    if (exp[0] > 23.9 && exp[0] < 24.1) {
                                      return exp[1] + '=24';
                                    }
                                }
                            }
                        }
                  }

            }
          }
        }

    }
    return 'No solution';
  }
  private getExp(nums: number[], op: string[], patternId: number): [number, string] {
    let equation = '';
    let result;
    switch (patternId) {
        // express 0----------------------am1bm2cm3d
        case 0:
            equation = nums[0] + op[0] + nums[1] + op[1] + nums[2] + op[2] + nums[3];
            result = this.calculate(nums, op);
            return [result, equation];

        // express 1-----------------------'(am1b)m2cm3d'
        case 1:
            result = this.cal(nums[0], nums[1], op[0]);
            result = this.calculate([result, nums[2], nums[3]], [op[1], op[2]]);
            equation = '(' + nums[0] + op[0] + nums[1] + ')' + op[1] + nums[2] + op[2] + nums[3];
            return [result, equation];
        // express 2--------------------------'(am1bm2c)m3d'
        case 2:
            result = this.calculate(nums.slice(0, 3), op.slice(0, 2));
            result = this.cal(result, nums[3], op[2]);
            equation = '(' + nums[0] + op[0] + nums[1] + op[1] + nums[2] + ')' + op[2] + nums[3];
            return [result, equation];
        // express 3 -----------------------'((am1b)m2c)m3d'
        case 3:
            result = this.cal(nums[0], nums[1], op[0]);
            result = this.cal(result, nums[2], op[1]);
            result = this.cal(result, nums[3], op[2]);
            equation = '((' + nums[0] + op[0] + nums[1] + ')' + op[1] + nums[2] + ')' + op[2] + nums[3];
            return [result, equation];
        // express 4---------------------------'(am1(bm2c))m3d'
        case 4:
            result = this.cal(nums[1], nums[2], op[1]);
            result = this.cal(nums[0], result, op[0]);
            result = this.cal(result, nums[3], op[2]);
            equation = '(' + nums[0] + op[0] + '(' + nums[1] + op[1] + nums[2] + '))' + op[2] + nums[3];
            return [result, equation];
        // express 5******************************'am1(bm2c)m3d'
        case 5:
            result = this.cal(nums[1], nums[2], op[1]);
            result = this.calculate([nums[0], result, nums[3]], [op[0], op[2]]);
            equation = nums[0] + op[0] + '(' + nums[1] + op[1] + nums[2] + ')' + op[2] + nums[3];
            return [result, equation];
        // express 6*****************************'am1(bm2cm3d)'
        case 6:
            result = this.calculate(nums.slice(1, 4), op.slice(1, 3));
            result = this.cal(nums[0], result, op[0]);
            equation = nums[0] + op[0] + '(' + nums[1] + op[1] + nums[2] + op[2] + nums[3] + ')';
            return [result, equation];
        // express 7------------------------------'am1((bm2c)m3d)'
        case 7:
            result = this.cal(nums[1], nums[2], op[1]);
            result = this.cal(result, nums[3], op[2]);
            result = this.cal(nums[0], result, op[0]);
            equation = nums[0] + op[0] + '((' + nums[1] + op[1] + nums[2] + ')' + op[2] + nums[3] + ')';
            return [result, equation];
        // express 8-------------------------------'am1(bm2(cm3d))'
        case 8:
            result = this.cal(nums[2], nums[3], op[2]);
            result = this.cal(nums[1], result, op[1]);
            result = this.cal(nums[0], result, op[0]);
            equation = nums[0] + op[0] + '(' + nums[1] + op[1] + '(' + nums[2] + op[2] + nums[3] + '))';
            return [result, equation];
        // express 9-------------------------------'am1bm2(cm3d)'
        case 9:
            result = this.cal(nums[2], nums[3], op[2]) ;
            result = this.calculate([nums.slice(0, 2), result], op.slice(0, 2));
            equation = nums[0] + op[0] + nums[1] + op[1] + '(' + nums[2] + op[2] + nums[3] + ')';
            return [result, equation];
        // express 10------------------------------'(am1b)m2(cm3d)'
        default:
            result = this.cal(this.cal(nums[0], nums[1], op[0]), this.cal(nums[2], nums[3], op[2]), op[1]);
            equation = '(' + nums[0] + op[0] + nums[1] + ')' + op[1] + '(' + nums[2] + op[2] + nums[3] + ')';
            return [result, equation];
    }
  }
  private calculate(nums: number[], op: string[]): number {

    if (op.length === 1) {
      return this.cal(nums[0], nums[1], op[0]);
    } else if (op.length === 0) { return null;
    } else {
        for (let i = 0; i < op.length; i++) {
          if (op[i] === '*') {
            const temp = nums[i] * nums[i + 1];
            nums[i] = temp;
            delete nums[i + 1];
            delete op[i];
            return this.calculate(nums, op);
          } else if (op[i] === '/' ) {
            const temp = nums[i] / nums[i + 1];
            nums[i] = temp;
            delete nums[i + 1];
            delete op[i];
            return this.calculate(nums, op);
          }
        }
        for (let i = 0; i < op.length; i++) {
          if (op[i] === '+') {
            const temp = nums[i] + nums[i + 1];
            nums[i] = temp;
            delete nums[i + 1];
            delete op[i];
            return this.calculate(nums, op);
          } else if (op[i] === '-' ) {
            const temp = nums[i] - nums[i + 1];
            nums[i] = temp;
            delete nums[i + 1];
            delete op[i];
            return this.calculate(nums, op);
          }
        }
    }
  }
  private cal(a: number, b: number, operation: string): number {
    switch (operation) {
      case '*':
        return a * b;
      case '/':
        return a / b;
      case '-':
        return a - b;
      default:
        return a + b;
    }
  }

}
