import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Record } from '../lib';
import { map } from 'rxjs/operators';

@Injectable()
export class JukeService {
    private mediansUrl = '/assets/hanzi/medians.bin';
    private dictionaryurl = '/assets/hanzi/dictionary.txt';

    constructor(private http: HttpClient) {
    }

    loadMedians(): Observable<any[]> {
        return this.http.get(this.mediansUrl, { responseType: 'arraybuffer' }).pipe(
            map(res => this.transform(res))
        );
    }

    loadDictionary(): Observable<any> {
        return this.http.get(this.dictionaryurl);
    }

    private transform(e): any[] {
        let arr = [];
        for (let i = 0; i < e.length;) {
            const a = this.n(e, i);
            arr.push(a[0]);
            i = a[1];
        }
        return arr;
    }

    private n(n, e): any {
        const r = String.fromCodePoint(n[e] + (n[e + 1] << 8))
            , a = []
            , i = n[e + 2];
        e += 3;
        for (let t = 0; i > t; t++) {
            const s = n[e];
            if (n.slice)
                a.push(n.slice(e + 1, e + s + 1));
            else {
                const o = [];
                for (let u = 0; s > u; u++)
                    o.push(n[e + u + 1]);
                a.push(o)
            }
            e += s + 1
        }
        return [[r, a], e]
    }

}
