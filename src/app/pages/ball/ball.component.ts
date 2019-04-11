import { Component, OnInit } from '@angular/core';
import { interval, fromEvent } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let duration = 5; // in seconds
    const numbers = interval(1000);
      numbers.pipe(take(duration)).subscribe(res => console.log(res));
      const clicks = fromEvent(document, 'click');
      const positions = clicks.pipe(map(ev => ev['clientX']));
      positions.subscribe(x => console.log(x));
  }

}
