import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Ball, Dot, KEY, RA, ANG, HEIGHT, Margin, COL } from './ball.model';
import * as ballActions from './ball.actions';
import { IBallState} from './ball.reducer';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {
  @ViewChild('container') container: any;
  balls: Ball[];
  dots: Dot[];
  numberShow = false;
  launching = false;
  private angle = RA;
  private speed = 10;
  private cw: number;
  private bw: number;
  constructor(private store: Store<IBallState>) {
    store.pipe(select('iStates')).subscribe(state => {
      this.balls = state.balls;
      this.balls.map((ball, i) => {
        if (ball.status === 'toLaunch') return ball;
        if (i % COL > 0 && this.balls[i - 1].colorId === ball.colorId) {
          this.mergeBallUnion(this.balls[i - 1], ball);
        }
        if (Math.floor(i / COL) > 0 && this.balls[i - COL].colorId === ball.colorId) {
          this.mergeBallUnion(this.balls[i - COL], ball);
        }
        return ball;
      });
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
    this.cw = this.container.nativeElement.offsetWidth;
    this.bw = this.cw / COL;
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
    this.store.dispatch(new ballActions.ToggleNumber());
  }

  private launch(): void {
    this.launching = true;
    const margin = {left: Math.cos(this.angle) * this.speed, top: Math.sin(this.angle) * this.speed};

    const targetBalls = this.getTargetBalls(); console.log(targetBalls)
    const launchedBall = this.getLaunchBall();
    if (launchedBall) {
      this.checkCollusion(targetBalls, launchedBall, margin);
    }
  }
  private getTargetBalls(): Ball[] {
    const balls = this.balls.filter((ball, i) => {
      return ball.status !== 'toLaunch' && ball.show &&
          (i >= 40 ||
          (this.angle === RA && (i % COL === 3 || i % COL === 4)) ||
          (this.angle < RA && (i % COL < 4)) ||
          (this.angle > RA && (i % COL >= 4)));
    }).sort((b1: Ball, b2: Ball) => b2.index - b1.index); console.log(balls)

    const _isColValid = (...args) => { console.log(args)
      const temp = args.map(n => balls[n].index);
      for (let i = 1; i < temp.length; i++ ) {
        if (temp[i - 1] !== temp[i] + 1) return false;
      }
      return true;

    };
    const arr = [];
    for (let i = 0; i < balls.length; i ++) {
      if (balls[i].index >= 40) arr.push(balls[i]);
      if (this.angle === RA && balls[i].index % COL === 4 && balls.length >= i + 1 && _isColValid(i, i + 1)) {
        arr.push(balls[i], balls[i + 1]);
        return arr;
      } else if ((this.angle < RA && balls[i].index % COL === 3 || this.angle > RA && balls[i].index % COL === 7)
        && balls.length >= i + 3
        && _isColValid(i, i + 1, i + 2, i + 3)
      ) {
        arr.push(balls[i], balls[i + 1], balls[i + 2], balls[i + 3]);
        return arr;
      } else {
        arr.push(balls[i]);
      }
    }
      return arr;
  }

  private getLaunchBall(): Ball {
    return this.balls.filter((ball) => ball.status === 'toLaunch')[0];
  }

  private checkCollusion(targetBalls: Ball[], launchedBall: Ball, margin: Margin): void {
    const w = this.cw / 2 - this.bw / 2;
    const move_x = w + launchedBall.marginLeft;
    const move_y = launchedBall.margin && launchedBall.margin.top ? launchedBall.margin.top - this.bw / 2 : HEIGHT;
    const stopBall = (lastMargin: Margin) => {
      this.store.dispatch(new ballActions.Move(lastMargin));
      this.launching = false;
      launchedBall.status = 'stopped';
      this.store.dispatch(new ballActions.Add(new Ball('toLaunch')));
    };
    const checkBallColor = (ball: Ball) => {
      if (ball.colorId === launchedBall.colorId) {
        const union = this.mergeBallUnion(ball, launchedBall);
        if (union.length > 2) {
          union.forEach(n => this.balls[n].show = false);
        }
      }
    }

    for (let ball of targetBalls) {
      const ball_x = ball.index < 40? ball.index % COL * this.bw : w + ball.marginLeft;
      const ball_y = Math.floor(ball.index / COL) * this.bw;
      const dist = Math.hypot(Math.abs(move_x - ball_x), Math.abs(move_y - ball_y));
      if (dist - this.bw < this.speed) {
        const speed = dist - this.bw;
        const lastMargin: Margin = {left: margin.left * speed / this.speed, top: margin.top * speed / this.speed};
        // console.log(move_x, move_y, ball_x, ball_y, lastMargin, this.bw, dist);
        if (this.compareNumber(margin.left, move_x - ball_x - lastMargin.left)) {
          stopBall(lastMargin);
          checkBallColor(ball);
          return;
        } else {

        }
      }
    }
    if (w - Math.abs(launchedBall.marginLeft) < Math.abs(margin.left)) {
      const left = margin.left < 0 ? -(w - Math.abs(launchedBall.marginLeft)) : w - Math.abs(launchedBall.marginLeft);
      const lastMargin: Margin = {left: left, top: margin.top * left / margin.left};
      stopBall(lastMargin);
      return;
    } else if  (launchedBall.margin && launchedBall.margin.top && launchedBall.margin.top - this.bw / 2 < margin.top) {
      const top = launchedBall.margin.top - this.bw / 2;
      const lastMargin: Margin = {left: top / margin.top * margin.left, top: top};
      stopBall(lastMargin);
      return;
    }
    this.store.dispatch(new ballActions.Move(margin)); // console.log(launchedBall.margin, margin);

    setTimeout(() => {
      this.checkCollusion(targetBalls, launchedBall, margin);
    }, 100);
  }

  private compareNumber(n1: number, n2: number): boolean {
    return (n1 > 0 && n2 > 0) || (n1 < 0 && n2 < 0) || (n1 === 0 && n2 === 0);
  }

  private mergeBallUnion(ball1: Ball, ball2: Ball): number[] {
    const arr = [...ball1.union];
    for (let n of ball2.union) {
      if (arr.indexOf(n) < 0) {
        arr.push(n);
      }
    }
    arr.forEach(n => this.balls[n].union = arr);
    return arr;
  }
}
