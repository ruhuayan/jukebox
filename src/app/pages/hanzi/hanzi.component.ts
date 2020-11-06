import { Component, OnInit, OnDestroy } from '@angular/core';
import { Animation, Loader, Record, Clip } from './lib';
import { Subscription, Observable } from 'rxjs';
import { IndexedDbService } from './lib/indexedDb.service';
// import { map } from 'rxjs/operators';

@Component({
    selector: 'app-hanzi',
    templateUrl: './hanzi.component.html',
    styleUrls: ['./hanzi.component.scss']
})
export class HanziComponent implements OnInit, OnDestroy {

    private dbSubscription: Subscription;
    private dictSubscription: Subscription;
    hanzis = [];
    animation = false;
    loader: Loader;
    paths: any[];
    clip$: Observable<Clip>;
    constructor(private indexedDbService: IndexedDbService) { }

    ngOnInit(): void {
        this.loader = new Loader();
        this.dbSubscription = this.indexedDbService.dbExisted$.subscribe(existed => {
            if (!existed) {
                this.dictSubscription = this.loader.loadDictionary().subscribe((res: Record[]) => {
                    for (let v in res) {
                        const record: Record = { hanzi: v, ...res[v] };
                        this.indexedDbService.put(record).subscribe();
                    }
                });

                // this.dictSubscription = this.loader.loadDictionary().pipe(
                //     map((res: Record[]) => res)
                // );
            }
        })
    }

    onMatch(hanzis: string[]): void {
        this.hanzis = hanzis;
    }

    find(hanzi: string): void {
        const code = hanzi.charCodeAt(0);
        this.indexedDbService.get(hanzi).subscribe(res => {
            console.log(res)
            this.paths = res.strokes.map((v) => { return { d: v, class: 'incomplete' } });//.reverse();
            var animation = new Animation(this.paths, res.medians);
            this.clip$ = animation.animate();
        });
        this.animation = true;
    }

    clear(): void {
        this.animation = false;
    }

    ngOnDestroy() {
        if (this.dbSubscription) {
            this.dbSubscription.unsubscribe();
        }
        if (this.dictSubscription) {
            this.dictSubscription.unsubscribe();
        }
    }
}