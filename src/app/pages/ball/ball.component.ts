import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, take, switchMap } from 'rxjs/operators';
import { Store, select, createSelector } from '@ngrx/store';
import { Ball, Dot, KEY, RA, ANG, HEIGHT, Margin } from './ball.model';
import * as ballActions from './ball.actions';
import { IBallState} from './ball.reducer';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {
  balls: Ball[];
  dots: Dot[];
  numberShow = false;
  // balls$: Observable<Ball>;
  // dots$: Observable<Dot>;
  // numberShow$: Observable<boolean>;
  launching = false;
  private angle = RA;
  private speed = 10;
  constructor(private store: Store<IBallState>) {
    store.pipe(select('iStates')).subscribe(state => {
      this.balls = state.balls;
      this.dots = state.dots;
      this.numberShow = state.numberShow;
    });
    // this.balls$ = store.pipe(select('iStates')).pipe(map(state => state.balls));
    // this.dots$ = store.pipe(select('iStates')).pipe(map(state => state.dots));
    // this.numberShow$ = store.pipe(select('iStates')).pipe(map(state => state.numberShow));
  }

  ngOnInit() {
    const keydown = fromEvent(document, 'keydown');
    keydown.pipe(map(ev => ev['which'])).subscribe(keycode => {
      if (this.launching) return;
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
    // this.launching = true;
    const margin = {left: 0, top: 0};

    if (this.angle === RA) {
      margin.left = 0;
      margin.top = this.speed;
    } else if (this.angle < RA) {
      margin.left = Math.cos(this.angle) * this.speed;
      margin.top = Math.sin(this.angle) * this.speed; 
    } else if (this.angle > RA) {
      margin.left = -Math.cos(Math.PI - this.angle) * this.speed;
      margin.top = Math.sin(Math.PI - this.angle) * this.speed;         
    }

    const targetBalls = this.getTargetBalls();
    const launchBall = this.getLaunchBall();

    this.checkCollusion(targetBalls, launchBall, margin);
    
  }
  private getTargetBalls(): Ball[] {
    return this.balls.filter((ball, i) => {
      return ball.status !== 'toLaunch' &&
          (i >= 40 || 
          (this.angle === RA && (i % 8 ===3 || i % 8 ===4)) ||
          (this.angle < RA && (i % 8 < 4)) ||
          (this.angle > RA && (i % 8 >= 4)))
    });
  }

  private getLaunchBall(): Ball {
    return this.balls.filter((ball) => ball.status === 'toLaunch')[0];
  }

  private checkCollusion(targetBalls: Ball[], launchBall: Ball, margin: Margin): void {
    this.store.dispatch(new ballActions.Move(margin));
  }
}
