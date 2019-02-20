import { Observable } from 'rxjs/internal/Observable';
import { BeatService } from './beat.service';
import './string.extensions';
declare let require: any;
const AudioMetadata = require('audio-metadata');

export class BufferLoader {
  context: AudioContext;
  constructor (context: AudioContext) {
    this.context = context;
  }
  loadBuffer(url: string): any {
    const request = new XMLHttpRequest;
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    const loader = this;

    const bufferObservable = new Observable((observer) => {

      request.onload = () => {
        const metadata: Metadata = <Metadata>AudioMetadata.id3v2(request.response);
        observer.next(metadata);
        loader.context.decodeAudioData(
          request.response,
          function(buffer) {
              if (!buffer) {
                console.error('error decoding file data: ' + url);
                return;
              }
              observer.next(<AudioBuffer>buffer);
              observer.complete();
          },
          function(error) {
              console.error('decodeAudioData error', error);
          }
        );
      };
      request.onerror = function() {
        console.error('BufferLoader: XHR error');
      };
      request.send();
    });
    return bufferObservable;
  }
}

export class Jukebox {
  private timePaused = 0;
  private loadTime = 0;
  private isPlaying = false;
  private startTime = 0;
  private startOffset = 0;  // time Played
  // private theme: number;
  private context: AudioContext;
  private analyser: any;
  private gainNode: any;
  private freqs: Uint8Array;
  private times: Uint8Array;
  private musics: string[];
  private buffer: any;
  private source: any;
  private mIndex: number;
  private metadata: Metadata =  {title: null, artist: null, album: null};

  constructor (context: AudioContext, musics: string[], private beatService: BeatService) {
    this.context = context;
    this.musics = musics;
    this.mIndex = Math.floor(Math.random() * this.musics.length);
    this.analyser = this.context.createAnalyser();
    this.gainNode = this.context.createGain();

    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;

    this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
    this.times = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.smoothingTimeConstant = 0.85;
    this.analyser.fftSize = 256;
  }

  // setMusics(musics: string[]) {
  //   this.musics = musics;
  // }
  load(): Observable<boolean> {
    const url = this.musics[this.mIndex];
    const bufferLoader = new BufferLoader(this.context);

    return new Observable(observer => {
      bufferLoader.loadBuffer(url).subscribe(buffer => {
        if (!buffer) {
          console.error('load buffer error!');
          observer.next(false);
        } else if (buffer instanceof AudioBuffer) {
          this.buffer = buffer;
          this.loadTime = this.context.currentTime;
          this.start();
          observer.next(true);
          observer.complete();
        } else {
          if (typeof buffer === 'object') {
            this.metadata = buffer;
            this.cleanMetaData();
            this.beatService.metadata$.next(this.metadata);
          }
        }
      }, err => { console.log('error'); });
    });

  }
  start() {
    this.startTime = this.context.currentTime - this.loadTime;
    this.timePaused = this.context.currentTime - this.startOffset;
    this.source = this.context.createBufferSource();
    this.source.connect(this.analyser);
    this.analyser.connect(this.gainNode);    // does not work
    this.gainNode.connect(this.context.destination);
    this.source.buffer = this.buffer;
    this.source.loop = false;
    this.source[this.source.start ? 'start' : 'noteOn'](0, this.startOffset % this.buffer.duration, this.buffer.duration);
    const self = this;
    this.source.onended = function() {
      self.isPlaying = false;
      console.log('music ends at context time: ', self.context.currentTime - self.timePaused, self.buffer.duration);
      self.beatService.isPlaying$.next(false);
      if (self.context.currentTime - self.timePaused >= self.buffer.duration) {
        self.startOffset = 0;
      }
    };

    this.isPlaying = true;
    this.beatService.isPlaying$.next(true);
    this.beat();
  }
  beat() {
    this.analyser.getByteFrequencyData(this.freqs);
    this.analyser.getByteTimeDomainData(this.times);
    const timelapse = (this.context.currentTime - this.timePaused) / this.buffer.duration * 100;
    this.beatService.setBeat({freqs: this.freqs, times: this.times,
                              frequencyBinCount: this.analyser.frequencyBinCount, timelapse: timelapse});

    if (this.isPlaying) {
      const self = this; // console.log(timelapse)
      setTimeout( () => {self.beat(); }, 1000 / 60);
    }
  }
  pause() {
    this.source[this.source.stop ? 'stop' : 'noteOff'](0);
    this.startOffset += (this.context.currentTime - this.startTime);   console.log('paused at', this.startOffset);
    this.isPlaying = false;
    // this.beatService.isPlaying$.next(false);
  }
  next(): Observable<boolean> {
    this.pause();
    this.mIndex = this.mIndex++ % this.musics.length;
    return this.load();
  }
  previous(): Observable<boolean> {
    this.pause();
    this.mIndex = this.mIndex === 0 ? this.musics.length - 1 : this.mIndex--;
    return this.load();
  }
  setVolumn(v: number) {
    this.gainNode.gain.value = v;
  }
  getMetadata(): Observable<Metadata>{
      return new Observable(observer => {
        this.cleanMetaData();
        observer.next(this.metadata);

      });
  }
  getLyric(metadata: Metadata): string {
    return null;
  }
  private cleanMetaData() {
    if (this.metadata.title) {
      Object.keys(this.metadata).map(key => {
        this.metadata[key] = this.metadata[key].leftStrip().removeCodeZero();
      });
    }
  }

}

export interface Beat {
  freqs: Uint8Array;
  times: Uint8Array;
  frequencyBinCount: number;
  timelapse?: number;
}

export interface Metadata {
  title: string;
  artist?: string;
  album?: string;
}

