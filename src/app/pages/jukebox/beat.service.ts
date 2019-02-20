import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable'
import { Subject } from 'rxjs/internal/Subject';
import { Beat, Metadata } from './jukebox.model';

@Injectable()
export class BeatService {
    private beatSubject: Subject<Beat> = new BehaviorSubject(null);
    metadata$: Subject<Metadata> = new BehaviorSubject({title: null, artist: null, album: null});
    isPlaying$: Subject<boolean> = new BehaviorSubject(false);

    constructor() {}
    setBeat(b: Beat) {
        this.beatSubject.next(b);
    }
    getBeat(): Observable<Beat> {
        return this.beatSubject;
    }

    setMetadata(m: Metadata) {
        this.metadata$.next(m);
    }
    setIsPlaying(b: boolean) {
      this.isPlaying$.next(b);
    }

}
