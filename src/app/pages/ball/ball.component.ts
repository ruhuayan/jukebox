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

  // container width
  private cw: number;
  // ball width
  private bw: number;

  constructor(private store: Store<IBallState>) {
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
    this.store.pipe(select('iStates')).subscribe(state => {
      this.balls = state.balls; // console.log(this.balls)
      this.dots = state.dots;
      this.numberShow = state.numberShow;
    });
  }

  private launch(): void {
    this.launching = true;
    // move (x, y)
    const margin = this.calculateMargin(this.speed);
    // Distance of launching ball to left, right wall
    const distanceToWall = Math.abs((this.cw / 2 - this.bw / 2) / Math.cos(this.angle));
    const distanceToTop = Math.abs((HEIGHT - this.bw / 2) / Math.sin(this.angle));
    const targetBalls = this.getTargetBalls(distanceToWall);
    const launchedBall = this.getLaunchBall();
    if (launchedBall) {
      launchedBall.angle = this.angle;
      if (targetBalls.length) {
        launchedBall.dist = targetBalls[0].launchDist;
        targetBalls.forEach((ball: Ball) => {
          ball.linkBall(launchedBall);
          if (ball.colorId === launchedBall.colorId) {
            ball.unionBall(launchedBall, this.balls);
          }
        });

        if (Math.abs(distanceToWall - targetBalls[0].launchDist) <= 1) {
          launchedBall.link.push(-1);
        }
      } else {
        launchedBall.dist = distanceToWall < distanceToTop ? distanceToWall : distanceToTop;
        launchedBall.link = [-1];
      }
      console.log(targetBalls, launchedBall, distanceToWall, distanceToTop);
      this.checkCollusion(targetBalls, launchedBall, margin);
    }
  }

  /**
   *   Calculate distance between ball and lauching ball
   *   b2 = a2 + c2 + 2ac * cos(<b)
   *   D = (2a cos(<b))**2 - 4 (a2 - b2)
   *   if D > 0, ball collide with launching ball
   *   return the top 2 balls will collide
   *   if their launchDist(s) are close to 1px;
   **/
  private getTargetBalls(distanceToWall: number): Ball[] {
    let shortestDist = HEIGHT;
    return this.balls.filter((ball: Ball) => ball.status !== 'toLaunch' && ball.show)
      .filter((ball: Ball) => {
        const ang = Math.abs(ball.angle - this.angle);
        const D = (2 * ball.dist * Math.cos(ang)) ** 2 - 4 * (ball.dist ** 2 - this.bw ** 2);

        if (D <= 0) return false;

        ball.launchDist = (Math.abs(2 * ball.dist * Math.cos(ang)) - Math.sqrt(D)) / 2;
        shortestDist = shortestDist > ball.launchDist ? ball.launchDist : shortestDist;
        // launchDist should be short than distanceToWall, or it will hit the wall
        return distanceToWall >= ball.launchDist - 1;

      }).filter((ball: Ball) => ball.launchDist - shortestDist <= 1);
  }

  private getLaunchBall(): Ball {
    return this.balls.filter((ball) => ball.status === 'toLaunch')[0];
  }

  private checkCollusion(targetBalls: Ball[], launchedBall: Ball, margin: Margin): void {

    if (targetBalls.length) {
      for (let ball of targetBalls) {
        if (ball.launchDist <= this.speed) {
          const lastMargin: Margin = this.calculateMargin(ball.launchDist);

          this.stopLaunchedBall(launchedBall, lastMargin);
          this.removeUnion(launchedBall);
          return;
        } else {
          ball.launchDist -= this.speed;
        }
      }
    } else {
      const w = this.cw / 2 - this.bw / 2;
      if (w - Math.abs(launchedBall.marginLeft) < Math.abs(margin.left)) {
        const left = margin.left < 0 ? -(w - Math.abs(launchedBall.marginLeft)) : w - Math.abs(launchedBall.marginLeft);
        const lastMargin: Margin = {left: left, top: margin.top * left / margin.left}; // error
        this.stopLaunchedBall(launchedBall, lastMargin);
        return;
      } else if  (launchedBall.margin && launchedBall.margin.top && launchedBall.margin.top - this.bw / 2 < margin.top) {
        const top = launchedBall.margin.top - this.bw / 2;
        const lastMargin: Margin = {left: top / margin.top * margin.left, top: top};
        this.stopLaunchedBall(launchedBall, lastMargin);
        return;
      }
    }
    this.store.dispatch(new ballActions.Move(margin)); // console.log(launchedBall.margin, margin);

    setTimeout(() => {
      this.checkCollusion(targetBalls, launchedBall, margin);
    }, 100);
  }

  private stopLaunchedBall(launchedBall: Ball, lastMargin: Margin): void {
    this.store.dispatch(new ballActions.Move(lastMargin));
    this.launching = false;
    launchedBall.status = 'stopped';
    if (launchedBall.dist > this.bw) {
      this.store.dispatch(new ballActions.Add(new Ball('toLaunch')));
    } else {
      setTimeout(() => window.alert('You lost !!!'), 100);
    }
    
  }

  private removeUnion(ball: Ball): void {

    if (ball.union.length > 2) {

      const affects = this.balls.filter(b => b.show && b.status !== 'toLaunch')
                .filter((b: Ball) => {

                  let affected = false;
                  ball.union.forEach(n => {

                    this.balls[n].show = false;
                    if (b.link.indexOf(n) >= 0) {
                      b.link.splice(b.link.indexOf(n), 1);
                      affected = true;
                    }
                  });
                  if (b.link.length === 0) {
                    b.show = false;
                  }
                  return affected && b.show;
                });
      console.log(affects)
      //affects.sort((b1: Ball, b2: Ball) => b2.index - b1.index)
      affects.forEach((b: Ball) => {
                const brokenLinks = this.getBrokenLinks(b, []); console.log(b, 'broken', brokenLinks);
                if (b.show && brokenLinks.length) {
                  b.show = false;
                  brokenLinks.forEach(n => this.balls[n].show = false);
                }
      });
    }
  }

  private getBrokenLinks(ball: Ball, arr: number[]): number[] {
    if (ball.link.indexOf(-1) >= 0) {
      return [];
    }

    if (arr.indexOf(ball.index) < 0) {
      arr.push(ball.index);
      for (let n of ball.link) {
        if (arr.indexOf(n) < 0) {
          return this.getBrokenLinks(this.balls[n], arr);
        }
      }
      return arr;
    }
  }

  private calculateMargin(speed: number): Margin {
    return {left: Math.cos(this.angle) * speed, top: Math.sin(this.angle) * speed};
  }

  // add() {
  //   const ball = new Ball();
  //   if (Ball.count <= 48) {
  //     this.store.dispatch(new ballActions.Add(ball));
  //   }
  // }

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
}
