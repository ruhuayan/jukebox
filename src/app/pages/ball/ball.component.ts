import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { map, debounceTime, takeWhile, tap, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Ball, Dot, Status, KEY, RA, ANG, Container, Margin, COL, Square } from './ball.model';
import * as ballActions from './state/ball.actions';
import { IBallState } from './state/ball.reducer';
import { fromEvent, interval, Observable, of, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { selectAngle, selectBalls, selectDots, selectNumberShow } from './state/ball.selector';

@Component({
    selector: 'app-ball',
    templateUrl: './ball.component.html',
    styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit, OnDestroy {
    @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;
    balls: Ball[];
    // balls$: Observable<Ball[]>;
    dots$: Observable<Dot[]>;
    numberShow$: Observable<boolean>;
    launching = false;
    private angle = RA;
    private speed = 1000 / 60;

    private subscriptions: Subscription = new Subscription();
    private isTouchStart = false;

    constructor(private store: Store<IBallState>, private titleService: Title) {
        this.titleService.setTitle('Ball - richyan.com');
        this.store.dispatch(new ballActions.Load());
        // this.balls$ = store.pipe(select('iStates')).pipe(map(state => state.balls));
        this.dots$ = this.store.pipe(select(selectDots));
        // this.dots$.subscribe(v => console.log(v))
        this.numberShow$ = this.store.pipe(select(selectNumberShow));
    }

    ngOnInit() {
        const evtSubt = fromEvent(document, 'keydown')
            .pipe(
                map(ev => ev['which']),
            ).subscribe(keycode => {
                if (this.launching) { return; }
                switch (keycode) {
                    case KEY.LEFT:
                    case KEY.RIGHT:
                        this.moveArrows(keycode);
                        break;
                    case KEY.UP:
                        this.launch();
                        break;

                    default:
                        return;
                }
            });
        this.subscriptions.add(evtSubt);
        this.resetContainer();

        const resizeSubt = fromEvent(window, 'resize')
            .pipe(
                debounceTime(300),
                tap(_ => this.resetContainer())
            ).subscribe();
        this.subscriptions.add(resizeSubt);

        this.store.pipe(take(1), select(selectAngle)).subscribe(
            angle => this.angle = angle
        );
        const ballSubt = this.store.pipe(select(selectBalls)).subscribe(
            balls => this.balls = balls
        );
        this.subscriptions.add(ballSubt);
    }

    resetContainer(): void {
        const cw = this.container.nativeElement.offsetWidth;
        if (cw !== Container.width) {
            // reset container and ball's width
            Container.width = cw;
            Ball.width = Math.round(cw / COL);
            Container.height = cw < 410 ? 480 : 540;

            const c: Square = { width: cw, height: Container.height };
            this.store.dispatch(new ballActions.UpdateContainer(c));
        }
    }

    touchEvent(e: TouchEvent, direction: number): void {
        e.preventDefault();
        this.isTouchStart = true;
        this.moveArrows(direction);
    }
    endTouch(): void {
        this.isTouchStart = false;
    }

    private moveArrows(direction: KEY): void {

        if (direction === KEY.LEFT && this.angle > ANG ||
            direction === KEY.RIGHT && this.angle < Math.PI - ANG) {

            this.angle = direction === KEY.LEFT ? this.angle - ANG : this.angle + ANG;

            if (this.isTouchStart) {
                of(null).pipe(
                    take(1),
                    debounceTime(200),
                    tap(_ => this.store.dispatch(new ballActions.Angle(this.angle)))
                ).subscribe();
            } else {
                this.store.dispatch(new ballActions.Angle(this.angle));
            }
        }

        // repeat until touchEnd
        interval(200).pipe(
            takeWhile(_ => this.isTouchStart),
            tap(_ => this.moveArrows(direction))
        ).subscribe();
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    launch(): void {
        this.launching = true;
        // move (x, y)
        const margin = this.calculateMargin(this.speed);
        // Distance of launching ball to left, right wall
        const distanceToWall = Math.abs((Container.width / 2 - Ball.width / 2) / Math.cos(this.angle));
        const distanceToTop = Math.abs((Container.height - Ball.width / 2) / Math.sin(this.angle));
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
        let shortestDist = Container.height;
        return this.balls.filter((ball: Ball) => ball.status !== Status.TOLAUNCH && ball.show)
            .filter((ball: Ball) => {
                const ang = Math.abs(ball.angle - this.angle);
                const D = (2 * ball.dist * Math.cos(ang)) ** 2 - 4 * (ball.dist ** 2 - Ball.width ** 2);

                if (D <= 0) { return false; }

                ball.launchDist = (Math.abs(2 * ball.dist * Math.cos(ang)) - Math.sqrt(D)) / 2;
                shortestDist = shortestDist > ball.launchDist ? ball.launchDist : shortestDist;
                // launchDist should be short than distanceToWall, or it will hit the wall
                return distanceToWall >= ball.launchDist - 1;

            }).filter((ball: Ball) => ball.launchDist - shortestDist <= 1);
    }

    private getLaunchBall(): Ball {
        return this.balls.filter((ball) => ball.status === Status.TOLAUNCH)[0];
    }

    private checkCollusion(targetBalls: Ball[], launchedBall: Ball, margin: Margin): void {

        if (targetBalls.length) {
            for (const ball of targetBalls) {
                if (ball.launchDist <= this.speed) {
                    const lastMargin: Margin = this.calculateMargin(ball.launchDist);

                    this.stopLaunchedBall(launchedBall, lastMargin);
                    const removed = this.removeUnion(launchedBall);
                    this.resetLauchedBall(launchedBall, removed);
                    return;
                } else {
                    ball.launchDist -= this.speed;
                }
            }
        } else {
            const w = Container.width / 2 - Ball.width / 2;
            if (w - Math.abs(launchedBall.marginLeft) < Math.abs(margin.left)) {
                const left = margin.left < 0 ? -(w - Math.abs(launchedBall.marginLeft)) : w - Math.abs(launchedBall.marginLeft);
                const lastMargin: Margin = { left: left, top: margin.top * left / margin.left }; // error
                this.stopLaunchedBall(launchedBall, lastMargin);
                this.resetLauchedBall(launchedBall);
                return;
            } else if (launchedBall.margin && launchedBall.margin.top && launchedBall.margin.top - Ball.width / 2 < margin.top) {
                const top = launchedBall.margin.top - Ball.width / 2;
                const lastMargin: Margin = { left: top / margin.top * margin.left, top: top };
                this.stopLaunchedBall(launchedBall, lastMargin);
                this.resetLauchedBall(launchedBall);
                return;
            }
        }
        this.store.dispatch(new ballActions.Move(margin));

        setTimeout(() => {
            this.checkCollusion(targetBalls, launchedBall, margin);
        }, 100);
    }

    private stopLaunchedBall(launchedBall: Ball, lastMargin: Margin): void {
        this.store.dispatch(new ballActions.Move(lastMargin));
        this.launching = false;
        launchedBall.status = Status.STOPPED;
    }
    private resetLauchedBall(launchedBall, removed: boolean = false): void {
        if (removed) {
            navigator.vibrate(300);
        } else {
            navigator.vibrate(100);
        }
        if (launchedBall.dist < Ball.width && launchedBall.show) {
            setTimeout(() => window.alert('You lost !!!'), 100);
        } else {
            this.store.dispatch(new ballActions.Add(new Ball(Status.TOLAUNCH)));
        }
    }

    private removeUnion(ball: Ball): boolean {

        if (ball.union.length > 2) {

            const affects = this.balls.filter(b => b.show && b.status !== Status.TOLAUNCH)
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

            // affects.sort((b1: Ball, b2: Ball) => b2.index - b1.index)
            affects.forEach((b: Ball) => {
                const brokenLinks = this.getBrokenLinks(b, []);
                if (b.show && brokenLinks.length) {
                    b.show = false;
                    brokenLinks.forEach(n => this.balls[n].show = false);
                }
            });
            return true;
        }
        return false;
    }

    private getBrokenLinks(ball: Ball, arr: number[]): number[] {
        if (ball.link.indexOf(-1) >= 0) {
            return [];
        }

        if (arr.indexOf(ball.index) < 0) {
            arr.push(ball.index);
            for (const n of ball.link) {
                if (arr.indexOf(n) < 0) {
                    return this.getBrokenLinks(this.balls[n], arr);
                }
            }
            return arr;
        }
    }

    private calculateMargin(speed: number): Margin {
        return { left: Math.cos(this.angle) * speed, top: Math.sin(this.angle) * speed };
    }

    reset() {
        Ball.reset();
        this.angle = RA;
        this.store.dispatch(new ballActions.Reset());
    }

    showNumber(): void {
        this.store.dispatch(new ballActions.ToggleNumber());
    }
}
