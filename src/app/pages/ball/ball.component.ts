import { Component, OnInit } from '@angular/core';
import { interval, fromEvent, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store, select, createSelector } from '@ngrx/store';
// import { Effect } from '@ngrx/effects';
import { Ball } from './ball.model';
import * as ballActions from './ball.actions';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
// export const selectBalls = (state: AppState) => state.balls;
export class BallComponent implements OnInit {
  private COLORS = ['#009900', '#663399', '#6b8e23', '#ff00ff'];
  balls$: Observable<number>;

  constructor(private store: Store<{ count: number }>) {
    this.balls$ = store.pipe(select('balls')).pipe(map(state => state.balls));
    this.balls$.subscribe(balls => console.log(balls));
  }

  ngOnInit() {
      // const clicks = fromEvent(document, 'click');
      // const positions = clicks.pipe(map(ev => ev['clientX']));
      // positions.subscribe(x => console.log(x));
  }

  add() {
    const color = this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
    const ball = new Ball(color);
    this.store.dispatch(new ballActions.Add(ball));
  }

  remove(ball: Ball): void {
    this.store.dispatch(new ballActions.Remove(ball));
  }

  reset() {
    this.store.dispatch(new ballActions.Reset());
  }

}
