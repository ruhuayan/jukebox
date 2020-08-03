import { Component, OnInit, OnDestroy } from '@angular/core';
import { Animation, Loader, Record } from './lib';
import { Subscription } from 'rxjs';
import { IndexedDbService } from './lib/indexedDb.service';

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
    strokes: string[];
    clip = null;
    constructor(private indexedDbService: IndexedDbService) {}

    ngOnInit(): void {
        this.loader = new Loader();
        this.dbSubscription = this.indexedDbService.dbExisted$.subscribe(existed => {
            if (!existed) {
                this.dictSubscription = this.loader.loadDictionary().subscribe((res: Record[]) => {
                    for (let v in res) {
                        const record: Record = {hanzi: v, ...res[v]};
                        this.indexedDbService.put(record).subscribe(res => console.log(res));
                    }
                });
            }
        })
    }
    
    onMatch(hanzis: string[]): void {
        this.hanzis = hanzis;
    }

    find(hanzi: string): void {
        const code = hanzi.charCodeAt(0); console.log(hanzi, code);
        this.indexedDbService.get(hanzi).subscribe(res => {
            this.strokes = res.strokes;
            var animation = new Animation(this.strokes, res.medians);
            const animate = () => {
                const step = animation.step();
                const len = step.animations.length - (step.complete ? 0 : 1);
                console.log(step.animations.slice(len)[0]);
                this.clip = step.animations.slice(len)[0]
                if (!step.complete) {
                    // animation.requestAnimationFrame(animate)
                    setTimeout(animate, 1e3 / 60);
                } 
            }
            animate();
            // console.log(this.strokes)
        });
        this.animation = true;
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