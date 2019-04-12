import { Component, OnInit } from '@angular/core';
import { interval, fromEvent, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Effect } from '@ngrx/effects';
import { Ball } from './ball.model';
import { Add, Reset } from './ball.actions';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {

  count$: Observable<number>;
 
  constructor(private store: Store<{ count: number }>) {
    this.count$ = store.pipe(select('count'));
  }

  ngOnInit() {
    let duration = 5; 
    const numbers = interval(1000);
      numbers.pipe(take(duration)).subscribe(res => console.log(res));
      const clicks = fromEvent(document, 'click');
      const positions = clicks.pipe(map(ev => ev['clientX']));
      positions.subscribe(x => console.log(x));
  }

  add() {
    const ball = new Ball('#fff');
    this.store.dispatch(new Add(ball));
  }
 
  reset() {
    this.store.dispatch(new Reset());
  }

}
