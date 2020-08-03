const e = "？"; 
export class Decomposition {
    private static instance: Decomposition;
    ids_data = {
        "⿰": {
            label: "Left-to-right",
            arity: 2
        },
        "⿱": {
            label: "Top-to-bottom",
            arity: 2
        },
        "⿴": {
            label: "Surround",
            arity: 2
        },
        "⿵": {
            label: "Surround-from-above",
            arity: 2
        },
        "⿶": {
            label: "Surround-from-below",
            arity: 2
        },
        "⿷": {
            label: "Surround-from-left",
            arity: 2
        },
        "⿸": {
            label: "Surround-from-upper-left",
            arity: 2
        },
        "⿹": {
            label: "Surround-from-upper-right",
            arity: 2
        },
        "⿺": {
            label: "Surround-from-lower-left",
            arity: 2
        },
        "⿻": {
            label: "Overlaid",
            arity: 2
        },
        "⿳": {
            label: "Top-to-middle-to-bottom",
            arity: 3
        },
        "⿲": {
            label: "Left-to-middle-to-right",
            arity: 3
        }
    };

    private constructor() {
    }

    static getInstance(): Decomposition {
        if (!Decomposition.instance) {
            Decomposition.instance = new Decomposition();
        }
    
        return Decomposition.instance;
    }

    public collectComponents(e, a): any {
        a = a || [],
        "character" === e.type && "?" !== e.value && a.push(e.value);
        for (var t = e.children || [], o = Array.isArray(t), n = 0, t = o ? t : t[Symbol.iterator](); ; ) {
            var i;
            if (o) {
                if (n >= t.length)
                    break;
                i = t[n++]
            } else {let n;
                if (n = t.next(),
                n.done)
                    break;
                i = n.value
            }
            var l = i;
            this.collectComponents(l, a)
        }
        return a
    }

    public convertDecompositionToTree(r): any {
        var n = [0];
        r = r || e;
        var i = this.o(r, n);
        return this.a(n[0] === r.length, "Too many characters in " + r + "."),
        this.t(i, [])
    }

    public convertTreeToDecomposition(r): any {
        var e = [""];
        return this.n(r, e),
        e[0]
    }

    public getSubtree(r, e): any {
        for (var t = r, o = e, n = Array.isArray(o), i = 0, o = n ? o : o[Symbol.iterator](); ; ) {
            var l;
            if (n) {
                if (i >= o.length)
                    break;
                l = o[i++]
            } else { let i;
                if (i = o.next(),
                i.done)
                    break;
                l = i.value
            }
            var c = l;
            this.a(c >= 0 && c < t.children.length),
            t = t.children[c]
        }
        return t
    }

    private n(r, a): void {
        a[0] += "?" === r.value ? e : r.value;
        for (var t = r.children ? r.children.length : 0, o = 0; t > o; o++)
            this.n(r.children[o], a)
    }

    private a(r: boolean, e: string = ''): any {
        return r || console.error(e)
    }

    private o(t, n): any {
        this.a(n[0] < t.length, "Not enough characters in " + t + ".");
        var i = t[n[0]];
        if (n[0] += 1,
        this.ids_data.hasOwnProperty(i)) {
            for (var l = {
                type: "compound",
                value: i,
                children: []
            }, c = 0; c < this.ids_data[i].arity; c++)
                l.children.push(this.o(t, n));
            return l
        }
        return i === e ? {
            type: "character",
            value: "?"
        } : ("[" === t[n[0]] && (this.a("0123456789".indexOf(t[n[0] + 1]) >= 0),
        this.a("]" === t[n[0] + 2]),
        n[0] += 3),
        {
            type: "character",
            value: i
        })
    }

    private t(r, e): any {
        r.path = e;
        for (var a = (r.children || []).length, o = 0; a > o; o++)
            this.t(r.children[o], e.concat([o]));
        return r
    }
}