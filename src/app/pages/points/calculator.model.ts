import './array.extensions';

export class Calculator {
  static operations = ['+', '-', '*', '/'];
  private numbers: number[];
  constructor(numbers: number[]) {
    this.numbers = numbers;
  }

  public getExp(): string {
    if (this.numbers.length <= 1) {
      return 'No solution';
    }

    const verify = (result) => result > 23.99 && result < 24.01;

    const combinationes = this.permuteUnique(this.numbers); // this.numbers.combination();
    const probabilities = Calculator.operations.propabilities(
      this.numbers.length - 1
    );

    for (const nums of combinationes) {
      for (const ops of probabilities) {
        let result = this.calculate(nums, ops),
          exp = '';
        if (verify(result)) {
          exp = nums.reduce(
            (acc, curr, i) =>
              i > 0 ? `${acc}${ops[i - 1]}${curr}` : `${curr}`,
            ''
          );
          return exp + '=24';
        }

        // (a + b) from left to right
        for (let i = 0; i < ops.length; i++) {
          result = this.calculate(
            [
              ...nums.slice(0, i),
              this.cal(nums[i], nums[i + 1], ops[i]),
              ...nums.slice(i + 2),
            ],
            [...ops.slice(0, i), ...ops.slice(i + 1)]
          );

          if (verify(result)) {
            exp = nums
              .reduce((acc, curr, j) => {
                if (j === i) {
                  return [...acc, '(', curr, ops[i]];
                } else if (i === j - 1 && j <= ops.length - 1) {
                  return [...acc, curr, ')', ops[j]];
                } else if (i === j - 1 && j > ops.length - 1) {
                  return [...acc, curr, ')'];
                } else if (j <= ops.length - 1) {
                  return [...acc, curr, ops[j]];
                } else if (j > ops.length - 1) {
                  return [...acc, curr];
                }
              }, [])
              .join('');
            return exp + '=24';
          }
        }

        // ((a + b) + c) from left to right
        result = this.calculate(nums, ops, 'left');
        if (verify(result)) {
          exp = ops
            .reduce(
              (acc, curr, j) => {
                if (curr === '*' || curr === '/' || j === ops.length - 1) {
                  return [...acc, curr, nums[j + 1]];
                } else {
                  return ['(', ...acc, curr, nums[j + 1], ')'];
                }
              },
              [nums[0]]
            )
            .join('');
          return exp + '=24';
        }

        // (a + b) + (c + d) from both end to middle
        result = this.calculate(nums, ops, 'both');
        if (verify(result)) {
          const halfLen = Math.floor(nums.length / 2);
          const fullLen = nums.length;

          exp = ops
            .slice(0, halfLen - 1)
            .reduce(
              (acc, curr, j) => {
                if (curr === '*' || curr === '/' || j === ops.length - 1) {
                  return [...acc, curr, nums[j + 1]];
                } else {
                  return ['(', ...acc, curr, nums[j + 1], ')'];
                }
              },
              [nums[0]]
            )
            .join('');

          exp += ops
            .slice(halfLen - 1, fullLen - halfLen)
            .reduce((acc, curr, j) => {
              if (halfLen + j >= fullLen - halfLen) {
                return [...acc, curr];
              } else {
                return [...acc, curr, nums[halfLen + j]];
              }
            }, [])
            .join('');

          exp += ops
            .slice(fullLen - halfLen)
            .reverse()
            .reduce(
              (acc, curr, j) => {
                if (curr === '*' || curr === '/' || j === ops.length - 1) {
                  return [nums[fullLen - 2 - j], curr, ...acc];
                } else {
                  return ['(', nums[fullLen - 2 - j], curr, ...acc, ')'];
                }
              },
              [nums[fullLen - 1]]
            )
            .join('');

          return exp + '=24';
        }

        // a + (b + (c + d)) from right to left
        result = this.calculate(nums, ops, 'right');
        if (verify(result)) {
          const len = nums.length;
          exp = ops
            .reverse()
            .reduce(
              (acc, curr, j) => {
                if (curr === '*' || curr === '/' || j === ops.length - 1) {
                  return [nums[len - 2 - j], curr, ...acc];
                } else {
                  return ['(', nums[len - 2 - j], curr, ...acc, ')'];
                }
              },
              [nums[len - 1]]
            )
            .join('');
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
        if (isNaN(temp)) {
          return -1;
        }
        return this.calculate(
          [temp, ...nums.slice(2)],
          [...ops.slice(1)],
          order
        );
      } else if (order === 'right') {
        const len = nums.length;
        const temp = this.cal(nums[len - 2], nums[len - 1], ops[len - 2]);
        if (isNaN(temp)) {
          return -1;
        }
        return this.calculate(
          [...nums.slice(0, len - 2), temp],
          [...ops.slice(0, len - 2)],
          order
        );
      } else if (order === 'both' && ops.length >= 3) {
        const len = ops.length;
        const startTemp = this.cal(nums[0], nums[1], ops[0]);
        const endTemp = this.cal(nums[len - 1], nums[len], ops[len - 1]);
        if (isNaN(startTemp) || isNaN(endTemp)) {
          return -1;
        }
        return this.calculate(
          [startTemp, ...nums.slice(2, len - 1), endTemp],
          [...ops.slice(1, len - 1)],
          order
        );
      }
      // regular order
      for (let i = 0; i < ops.length; i++) {
        if (ops[i] === '*' || ops[i] === '/') {
          const temp = this.cal(nums[i], nums[i + 1], ops[i]);
          if (isNaN(temp)) {
            return -1;
          }
          return this.calculate(
            [...nums.slice(0, i), temp, ...nums.slice(i + 2)],
            [...ops.slice(0, i), ...ops.slice(i + 1)]
          );
        }
      }
      for (let i = 0; i < ops.length; i++) {
        if (ops[i] === '+' || ops[i] === '-') {
          const temp = this.cal(nums[i], nums[i + 1], ops[i]);
          return this.calculate(
            [...nums.slice(0, i), temp, ...nums.slice(i + 2)],
            [...ops.slice(0, i), ...ops.slice(i + 1)]
          );
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

  private permuteUnique(nums: number[]): number[][] {
    if (!nums.length) {
      return [];
    }
    const result = [];
    this.calcPermutation(nums, 0, result);
    return result;
  }

  private calcPermutation(nums: number[], offset: number, result: number[][]) {
    if (offset === nums.length) {
      result.push([...nums]);
      return;
    }

    const set = new Set();
    for (let i = offset; i < nums.length; ++i) {
      if (!set.has(nums[i])) {
        set.add(nums[i]);
        [nums[offset], nums[i]] = [nums[i], nums[offset]];
        this.calcPermutation(nums, offset + 1, result);
        [nums[offset], nums[i]] = [nums[i], nums[offset]];
      }
    }
  }
}
