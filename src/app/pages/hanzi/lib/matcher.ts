import { Point } from './point'

export interface Configs {
    points?: number,
    max_ratio?: number,
    min_width?: number,
    max_width?: number,
    side_length?: number
}

const calcul = {
    distance2: function (n, r) {
        return calcul.norm2(calcul.subtract(n, r))
    },
    norm2: function (t) {
        return t[0] * t[0] + t[1] * t[1]
    },
    round: function (t) {
        return t.map(Math.round)
    },
    subtract: function (t, n) {
        return [t[0] - n[0], t[1] - n[1]]
    }
}

export class Matcher {

    private medians;
    private params: Configs = { points: 4, max_ratio: 1, min_width: 8, side_length: 256 };
    constructor(medians, a: Configs = {}) {
        this.medians = medians;
        this.params = Object.assign({}, a, this.params);
    }

    public match(t, n) {
        if (0 === t.length) return [];

        n = n || 1;
        const r = [], a = [];

        t = this.preprocess(t); // console.log(t)
        for (var e = this.medians, i = Array.isArray(e), h = 0, e = i ? e : e[Symbol.iterator](); ;) {
            var u;
            if (i) {
                if (h >= e.length)
                    break;
                u = e[h++]
            } else {
                var iterVal
                if (iterVal = e.next(), iterVal.done)
                    break;
                u = iterVal.value
            }
            var s = u;
            if (s[1].length === t.length) {
                for (var c = this.o(t, s[1], this.params), f = a.length; f > 0 && c > a[f - 1];)
                    f -= 1;
                n > f && (r.splice(f, 0, s[0]),
                    a.splice(f, 0, c),
                    r.length > n && (r.pop(),
                        a.pop()))
            }
        }
        return r
    }

    public preprocess(strokes): void {
        return this.h(strokes, this.params)
    }

    private h(strokes, params: Configs) {
        if (0 === strokes.length || strokes.some(function (t) {
            return 0 === t.length
        })) {
            throw new Error("Invalid medians list: " + JSON.stringify(strokes));
        }

        var o = params.side_length
            , u = this.i(this.e(strokes), params.max_ratio, params.min_width)
            , s = [[0, 0], [params.side_length - 1, params.side_length - 1]]
            , c = this.a(u, s);
        var _this = this;
        return strokes.map(function (stroke) {
            var a = _this.r(stroke.map(c), params.points)
                , e = calcul.subtract(a[a.length - 1], a[0])
                , i = Math.atan2(e[1], e[0])
                , u = Math.round((i + Math.PI) * o / (2 * Math.PI)) % o
                , s = Math.round(Math.sqrt(calcul.norm2(e) / 2));
            return [].concat.apply([], a).concat([u, s])
        })
    }

    private r(n, r): any {
        for (var a = [], e = 0, i = 0; i < n.length - 1; i++)
            e += Math.sqrt(calcul.distance2(n[i], n[i + 1]));
        for (var h = 0, o = n[0], u = 0, i = 0; r - 1 > i; i++) {
            for (var s = i * e / (r - 1); s > u;) {
                var c = Math.sqrt(calcul.distance2(o, n[h + 1]));
                if (s > u + c)
                    h += 1,
                        o = n[h],
                        u += c;
                else {
                    var f = (s - u) / c;
                    o = [(1 - f) * o[0] + f * n[h + 1][0], (1 - f) * o[1] + f * n[h + 1][1]],
                        u = s
                }
            }
            a.push(calcul.round(o))
        }
        return a.push(n[n.length - 1]),
            a
    }

    private a(n, r): any {
        var a = calcul.subtract(n[1], n[0])
            , e = calcul.subtract(r[1], r[0])
            , i = [e[0] / a[0], e[1] / a[1]];
        return function (p: Point) {
            return [Math.round(i[0] * (p.x - n[0][0]) + r[0][0]), Math.round(i[1] * (p.y - n[0][1]) + r[0][1])]
        }
    }

    private e(strokes): any {
        var n = [1 / 0, 1 / 0]
            , r = [-(1 / 0), -(1 / 0)];
        return strokes.map(function (t) {
            return t.map(function (t: Point) {
                n[0] = Math.min(n[0], t.x),
                    n[1] = Math.min(n[1], t.y),
                    r[0] = Math.max(r[0], t.x),
                    r[1] = Math.max(r[1], t.y)
            })
        }),
            [n, r]
    }

    private i(n, r, a): any {
        n = n.map(calcul.round);
        var e = calcul.subtract(n[1], n[0]);
        if (e[0] < 0 || e[1] < 0)
            throw e;
        if (e[0] < a) {
            var i = Math.ceil((a - e[0]) / 2);
            n[0][0] -= i,
                n[1][0] += i
        }
        if (e[1] < a) {
            var i = Math.ceil((a - e[1]) / 2);
            n[0][1] -= i,
                n[1][1] += i
        }
        if (r > 0)
            if (e = calcul.subtract(n[1], n[0]),
                e[0] < e[1] / r) {
                var i = Math.ceil((e[1] / r - e[0]) / 2);
                n[0][0] -= i,
                    n[1][0] += i
            } else if (e[1] < e[0] / r) {
                var i = Math.ceil((e[0] / r - e[1]) / 2);
                n[0][1] -= i,
                    n[1][1] += i
            }
        return n
    }

    private o(t, n, r): any {
        for (var e = 0, i = r.points, h = 0; h < t.length; h++) {
            for (var o = t[h], u = n[h], s = 0; i > s; s++)
                e -= Math.abs(o[2 * s] - u[2 * s]),
                    e -= Math.abs(o[2 * s + 1] - u[2 * s + 1]);
            var c = Math.abs(o[2 * i] - u[2 * i])
                , f = (o[2 * i + 1] + u[2 * i + 1]) / r.side_length;
            e -= 4 * i * f * Math.min(c, r.side_length - c)
        }
        return e
    }
}