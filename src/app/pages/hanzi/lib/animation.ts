import { Point, Clip } from './';
import { Observable, of, timer, animationFrameScheduler } from 'rxjs';
import { repeat, takeWhile, map } from 'rxjs/operators';

const t = 128;

export class Animation {

    _delay: number;
    _speed: number;
    _completion: number;
    _len: number
    _strokes: any[];
    _lengths: number[];
    _paths: string[];

    constructor(strokes, medians, settings = {delay: .3, speed: .02}) {
        this._delay = 1024 * (settings.delay || .5),
        this._speed = 1024 * (settings.speed || .05),
        this._completion = 0,
        this._strokes = strokes,
        this._lengths = this.getLengths(medians);
        this._paths = medians.map(this.transform);
        this._len = this._strokes.length;
    }

    // public step() {
    //     this._completion += this._speed; 
    //     let e = this._completion
    //         , s = 0
    //         , i = [];
    //     for (s = 0; s < this._strokes.length; s++) {
    //         var n = Math.max(this._lengths[s] - e, 0);
    //         e -= this._lengths[s] + this._delay;
            
    //         if (e <= -this._delay && 0 >= e) console.log(s + '+' + e)
    //         // var a = "";
    //         // var completed = false;
    //         if (// e <= -this._delay ? completed = false : /*0 >= e &&*/ (completed = true),
    //         i.push({
    //             strokeId: s,
    //             completed: e > -this._delay, // completed,
    //             stroke: this._strokes[s],
    //             median: this._paths[s],
    //             dasharray: `${this._lengths[s]} ${2 * this._lengths[s]}`, 
    //             advance: n + t
    //         }),
    //         0 >= e)
    //             break
    //     }
    //     return {
    //         complete: s === this._strokes.length,
    //         animations: i
    //     }
    // }

    public animate(): Observable<Clip> {
        let num = 0;
        return of(null, animationFrameScheduler)
                .pipe(
                    takeWhile(_ => num < this._len),
                    map(_ => {
                        const clip = this.getClip(num);
                        if (clip.completed) {
                            this._strokes[num].class = 'complete';
                            num++;
                        }
                        return clip;
                    }),
                    repeat(),
                );
    }

    private getClip(n: number): Clip {
        this._completion += this._speed;
        let completion = this._completion, offset = 0;
        
        for (let i = 0; i <= n; i++) {
            offset = Math.max(this._lengths[i] - completion, 0);
            completion -= this._lengths[i] + this._delay;
        }
        return {
            id: n,
            completed: completion > -this._delay,
            stroke: this._strokes[n].d,
            path: this._paths[n],
            dasharray: `${this._lengths[n]} ${2 * this._lengths[n]}`, 
            offset: Math.round(offset + t)
        }
    }

    private getLengths(h): any {
        const _this = this;
        return h.map(function(e) {
            return _this.getLength(e) + t
        })
    }
    private getDistance(p1: Point, p2: Point): number {
        const p3 = new Point(p1.x - p2.x, p1.y - p2.y);
        return Math.round(Math.sqrt(p3.x * p3.x + p3.y * p3.y));
    }

    private getLength(t): number {
        let s = 0;
        for (let i = 0; i < t.length - 1; i++) {
            s += this.getDistance(Point.from(t[i]), Point.from(t[i + 1]));
        }
        return s
    }

    private transform(t): string {
        for (var e = [], s = t, i = Array.isArray(s), n = 0, s = i ? s : s[Symbol.iterator](); ; ) {
            var a;
            if (i) {
                if (n >= s.length)
                    break;
                a = s[n++]
            } else { let n;
                if (n = s.next(),
                n.done)
                    break;
                a = n.value
            }
            var h = a;
            e.push(0 === e.length ? "M" : "L"),
            e.push("" + h[0]),
            e.push("" + h[1])
        }
        return e.join(" ")
    }
}