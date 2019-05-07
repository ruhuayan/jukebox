import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, take, switchMap } from 'rxjs/operators';
import { Store, select, createSelector } from '@ngrx/store';
import { Ball, Dot, KEY, RA, ANG, HEIGHT } from './ball.model';
import * as ballActions from './ball.actions';
import { IBallState} from './ball.reducer';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {
  balls$: Observable<Ball>;
  dots$: Observable<Dot>;
  numberShow$: Observable<boolean>;
  private angle = RA;

  constructor(private store: Store<IBallState>) {

    this.balls$ = store.pipe(select('iStates')).pipe(map(state => state.balls));
    this.dots$ = store.pipe(select('iStates')).pipe(map(state => state.dots));
    this.numberShow$ = store.pipe(select('iStates')).pipe(map(state => state.numberShow));
  }

  ngOnInit() {
    const keydown = fromEvent(document, 'keydown');
    keydown.pipe(map(ev => ev['which'])).subscribe(keycode => {
      switch (keycode) {
        case KEY.LEFT:
          if (this.angle > ANG) {
            this.angle -= ANG;
            this.store.dispatch(new ballActions.Angle(RA - this.angle));
          }
          break;
        case KEY.RIGHT:
          if (this.angle < Math.PI - ANG) {
            this.angle += ANG;
            this.store.dispatch(new ballActions.Angle(RA - this.angle));
          }
          break;
        case KEY.UP:
          this.launch();
          break;

        default:
          return;
      }
    });
  }

  add() {
    const ball = new Ball();
    if (Ball.count <= 48) {
      this.store.dispatch(new ballActions.Add(ball));
    }
  }

  remove(ball: Ball, i: number): void {
    // ball.show = false;
    // this.store.dispatch(new ballActions.Remove(ball));
  }

  reset() {
    Ball.reset();
    this.store.dispatch(new ballActions.Reset());
  }

  showNumber(): void {
    this.store.dispatch(new ballActions.ToggleNumber());
  }

  private launch(): void {
    this.store.dispatch(new ballActions.Move({left: 0, top: `calc(${HEIGHT - 35}px - 100% / 16)`}));
  }
}
