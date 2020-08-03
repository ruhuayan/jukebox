const t = 128;

export class Animation {

    _delay: number;
    _speed: number;
    _completion: number;
    _strokes;
    _lengths;
    _paths;

    constructor(strokes, medians, settings = {delay: .3, speed: .02}) {
        this._delay = 1024 * (settings.delay || .5),
        this._speed = 1024 * (settings.speed || .05),
        this._completion = 0,
        this._strokes = strokes,
        this._lengths = this.getLengths(medians), console.log(this._lengths)
        this._paths = medians.map(this.i);
    }

    public animate() {
        const step = this.step();
        const len = step.animations.length - (step.complete ? 0 : 1);
        if (!step.complete) {
            this.requestAnimationFrame(this.animate)
        } 
    }
    public step() {
        this._completion += this._speed;
        var e = this._completion
            , s = 0
            , i = [];
        for (s = 0; s < this._strokes.length; s++) {
            var n = Math.max(this._lengths[s] - e, 0);
            e -= this._lengths[s] + this._delay;
            var a = "";
            if (e <= -this._delay ? a = "partial" : 0 >= e && (a = "complete"),
            i.push({
                "class": a,
                clip: "animation" + s,
                stroke: this._strokes[s],
                median: this._paths[s],
                length: this._lengths[s],
                dasharray: `${this._lengths[s]} ${2 * this._lengths[s]}`, 
                spacing: 2 * this._lengths[s],
                advance: n + t
            }),
            0 >= e)
                break
        }
        return {
            complete: s === this._strokes.length,
            animations: i
        }
    }

    public requestAnimationFrame(e) {
        return window.requestAnimationFrame || function(e) {
            return setTimeout(e, 1e3 / 60)
        }
    }

    private getLengths(h): any {
        const _this = this;
        return h.map(function(e) {
            return _this.s(e) + t
        })
    }
    private e(t, e): number {
        var s = [t[0] - e[0], t[1] - e[1]];
        return s[0] * s[0] + s[1] * s[1]
    }

    private s(t): number {
        for (var s = 0, i = 0; i < t.length - 1; i++)
            s += Math.sqrt(this.e(t[i], t[i + 1]));
        return s
    }

    private i(t): string {
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