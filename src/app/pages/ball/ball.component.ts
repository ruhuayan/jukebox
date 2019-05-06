import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, take, switchMap } from 'rxjs/operators';
import { Store, select, createSelector } from '@ngrx/store';
import { Ball, Dot, KEY } from './ball.model';
import * as ballActions from './ball.actions';
import { IBallState} from './ball.reducer';
import { fromEvent } from 'rxjs';

const RA = Math.PI / 2;
const ANG = Math.PI / 120;
const HEIGHT = 540;
@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {
  balls$: Observable<Ball>;
  numberShow = false;
  dots: Dot[];
  private angle = Math.PI / 2;

  constructor(private store: Store<IBallState>) {
    this.balls$ = store.pipe(select('balls')).pipe(map(state => state.balls));
    this.dots = Array.from(new Array(10).keys()).map(i => new Dot(null, HEIGHT - 12 * (i + 1)));
  }

  ngOnInit() {
    const keydown = fromEvent(document, 'keydown');
    keydown.pipe(map(ev => ev['which'])).subscribe(keycode => {
      switch (keycode) {
        case KEY.LEFT:
          // if (this.angle > this.ang)
          this.setAngle(ANG);
          break;
        case KEY.RIGHT:
          // if(this.angle < Math.PI - this.ang)
          this.setAngle(-ANG);
          break;
        case KEY.UP:
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
    ball.show = false;
    this.store.dispatch(new ballActions.Remove(ball));
  }

  reset() {
    Ball.reset();
    this.store.dispatch(new ballActions.Reset());
  }

  showNumber(): void {
    this.numberShow = ! this.numberShow;
  }

  private setAngle(ang) {
    this.angle = this.angle - ang;
    this.dots.map((dot, i) => {
      dot.y = HEIGHT - 12 + Math.cos(RA - this.angle) * (-12 * i);
      dot.x = Math.sin(RA - this.angle) * (-12 * i);
    });
  }
}
