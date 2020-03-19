import { Component, OnInit, OnDestroy } from '@angular/core';
import { Card } from '../../card/models/card.model';
import { Deck } from '../../card/models/deck.model';
import { Title } from '@angular/platform-browser';
import './array.extensions';

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
        for (let i = 0; i < this.cardNumber; i++) {
            setTimeout(() => {
                this.dealOneCard();
                if (i === this.cardNumber - 1) {
                    this.ondealing = false;
                }
            }, 200 * i);
        }
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
            this.solution = this.calculateExp();
        }
    }

    dealOneCard(): void {
        const card: Card = this.deck.dealOneCard();
        if (card) {
            this.dealedCards.push(card);
        }
    }
    calculateExp(): string {
        const operations = ['+', '-', '*', '/'];
        const numbers = this.dealedCards.map((card) => card.value);
        const verify = result => result > 23.99 && result < 24.01;

        // console.log(numbers.combination());
        // console.log(operations.propabilities(numbers.length - 1))
        const combinationes = numbers.combination(); 
        const probabilities = operations.propabilities(numbers.length - 1);
        
        for (let nums of combinationes) {
            for (let ops of probabilities) {
                let result = this.calculate(nums, ops), exp = '';
                if (verify(result)) {
                    exp = nums.reduce((acc, curr, i) => i > 0 ? `${acc}${ops[i - 1]}${curr}` : `${curr}`, '');
                    return exp + '=24';
                }

                // (a + b) from left to right
                for (let i = 0; i < ops.length; i++) {
                    result = this.calculate([...nums.slice(0, i), this.cal(nums[i], nums[i + 1], ops[i]), ...nums.slice(i + 2)], [...ops.slice(0, i), ...ops.slice(i + 1)]);

                    if (verify(result)) {
                        exp = nums.reduce((acc, curr, j) => {
                            if (j === i) return [...acc, '(', curr, ops[i]];
                            else if (i === j - 1 && j <= ops.length - 1) return [...acc, curr, ')', ops[j]];
                            else if (i === j - 1 && j > ops.length - 1) return [...acc, curr, ')'];
                            else if (j <= ops.length - 1) return [...acc, curr, ops[j]];
                            else if (j > ops.length - 1) return [...acc, curr];
                        }, []).join('');
                        return exp + '=24';
                    }
                }

                // ((a + b) + c) from left to right
                result = this.calculate(nums, ops, 'left');
                if (verify(result)) { console.log('order left', nums, ops)
                    exp = ops.reduce((acc, curr, j) => {
                        if (curr === '*' || curr === '/' || j === ops.length - 1) return [...acc, curr, nums[j + 1]];
                        else return ['(', ...acc, curr, nums[j + 1], ')'];
                    }, [nums[0]]).join('');
                    return exp + '=24';
                }

                // (a + b) + (c + d) from both end to middle 
                result = this.calculate(nums, ops, 'both');
                if (verify(result)) { console.log('both end', nums, ops)
                    
                    const halfLen = Math.floor(nums.length / 2);
                    const fullLen = nums.length;
                    
                    exp = ops.slice(0, halfLen - 1).reduce((acc, curr, j) => {
                        if (curr === '*' || curr === '/' || j === ops.length - 1) return [...acc, curr, nums[j + 1]];
                        else return ['(', ...acc, curr, nums[j + 1], ')'];
                    }, [nums[0]]).join('');

                    exp += ops.slice(halfLen - 1, fullLen - halfLen).reduce((acc, curr, j) => {
                        if (halfLen + j >= fullLen - halfLen) return [...acc, curr];
                        else return [...acc, curr, nums[halfLen + j]]
                    }, []).join('');

                    exp += ops.slice(fullLen - halfLen).reverse().reduce((acc, curr, j) => {
                        if (curr === '*' || curr === '/' || j === ops.length - 1) return [nums[fullLen - 2 - j], curr,  ...acc];
                        else return ['(', nums[fullLen - 2 - j], curr, ...acc, ')'];
                    }, [nums[fullLen - 1]]).join('');

                    return exp + '=24';
                }

                // a + (b + (c + d)) from right to left
                result = this.calculate(nums, ops, 'right');
                if (verify(result)) { console.log('order right', nums, ops)
                    const len = nums.length;
                    exp = ops.reverse().reduce((acc, curr, j) => {
                        if (curr === '*' || curr === '/' || j === ops.length - 1) return [nums[len - 2 - j], curr,  ...acc];
                        else return ['(', nums[len - 2 - j], curr, ...acc, ')'];
                    }, [nums[len - 1]]).join('');
                    return exp + '=24';
                }
            }
        }
        return 'No solution';
    }

    private calculate(nums: number[], ops: string[], order: string = ''): number {
        if (ops.length === 1) {
            return this.cal(nums[0], nums[1], ops[0]);
        } else {
            if (order === 'left') {
                const temp = this.cal(nums[0], nums[1], ops[0]);
                if (isNaN(temp)) return -1;
                return this.calculate([temp, ...nums.slice(2)], [...ops.slice(1)], order);
            } else if (order === 'right') {
                const len = nums.length;
                const temp = this.cal(nums[len - 2], nums[len - 1], ops[len -2]);
                if (isNaN(temp)) return -1;
                return this.calculate([...nums.slice(0, len - 2), temp], [...ops.slice(0, len - 2)], order);
            } else if (order === 'both' && ops.length >= 3) {
                const len = ops.length;
                const startTemp = this.cal(nums[0], nums[1], ops[0]);
                const endTemp = this.cal(nums[len - 1], nums[len], ops[len -1]);
                if (isNaN(startTemp) || isNaN(endTemp)) return -1;
                return this.calculate([startTemp, ...nums.slice(2, len - 1), endTemp], [...ops.slice(1, len - 1)], order);
            }
            // regular order
            for (let i = 0; i < ops.length; i++) {
                if (ops[i] === '*' || ops[i] === '/') {
                    const temp = this.cal(nums[i], nums[i + 1], ops[i]);
                    if (isNaN(temp)) return -1;
                    return this.calculate([...nums.slice(0, i), temp, ...nums.slice(i + 2)], [...ops.slice(0, i), ...ops.slice(i + 1)]);
                }
            }
            for (let i = 0; i < ops.length; i++) {
                if (ops[i] === '+' || ops[i] === '-') {
                    const temp = this.cal(nums[i], nums[i + 1], ops[i]);
                    return this.calculate([...nums.slice(0, i), temp, ...nums.slice(i + 2)], [...ops.slice(0, i), ...ops.slice(i + 1)]);
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

    // private combination(arr: number[]) : number[][] {
        
    //     if (arr.length === 1) return [[...arr]];
    //     else if (arr.length === 2) return [[...arr], [arr[1], arr[0]]];
    //     else return arr.reduce((acc, curr, i) => {
    //             return [...acc, ...this.combination([...arr.slice(0, i), ...arr.slice(i + 1)]).map(a => [arr[i], ...a])];
    //         }, []);
        
    // }

    // private propabilities(len: number, arr: string[] = ['+', '-', '*', '/']): string[][] {

    //     if (len === 1) return arr.map(op => [op]);
    //     else if (len === 2) return arr.map(op1 => arr.map(op2 => [op1, op2])).reduce((acc, cur) => [...acc, ...cur], []);
    //     else {
    //         return arr.map(op => this.propabilities(len - 1, arr).map(a => [op, ...a])).reduce((acc, cur) => [...acc, ...cur], [])
    //     }
    // }
}