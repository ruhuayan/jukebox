/// <reference lib="webworker" />
import { Calculator } from './calculator.model';

addEventListener('message', ({ data }) => {
    console.log('\nnumbers: ' + data.split(','));

    // console.time('Web Worker');
    const numbers = JSON.parse(data);
    const calculator = new Calculator(numbers);
    const exp = calculator.getExp();

    // console.timeEnd('Web Worker');
    postMessage(exp);
});
