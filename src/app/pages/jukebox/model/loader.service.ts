import { Injectable } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { map, takeWhile, tap } from 'rxjs/operators';
import { Metadata } from '../model/metadata.interface';
import * as AudioMetadata from 'audio-metadata';
import { HttpClient } from '@angular/common/http';

declare let window: any;

@Injectable()
export class LoaderService {

    private audioCtx = new (window['AudioContext'] || window['webkitAudioContext'])();
    private gainNode;
    private analyser;
    private source = null;
    private freqs: Uint8Array;
    private times: Uint8Array;

    private isPlaying = false;
    private theme = 1;
    private canvas: HTMLCanvasElement;
    private drawContext: CanvasRenderingContext2D;
    private metadata: Metadata;

    constructor(private http: HttpClient) {
        this.gainNode = this.audioCtx.createGain();
        this.analyser = this.audioCtx.createAnalyser();
        this.source = this.audioCtx.createBufferSource();
        this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
        this.times = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.minDecibels = -90;
        this.analyser.maxDecibels = -10;
        this.analyser.smoothingTimeConstant = 0.85;
        this.analyser.fftSize = 256;
    }

    load(url: string): Observable<ArrayBuffer> {
        return this.http.get(url, { responseType: 'arraybuffer' });
    }

    decodeAudioData(response: ArrayBuffer): Observable<AudioBuffer> {
        this.metadata = <Metadata>AudioMetadata.id3v2(response);

        return new Observable((observer) => {
            this.audioCtx.decodeAudioData(
                response,
                function (buffer) {
                    if (!buffer) {
                        observer.error('error decoding file data');
                        observer.complete();
                    }
                    observer.next(buffer);
                    observer.complete();
                },
                function (error) {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }

    loadMetaData(response: ArrayBuffer): Observable<Metadata> {
        const metadata: Metadata = <Metadata>AudioMetadata.id3v2(response);
        return of(metadata);
    }

    getMetaData(): Metadata {
        return this.metadata ? this.metadata : null;
    }

    start(audioBuffer: AudioBuffer): Observable<Boolean> {

        this.source.connect(this.analyser);
        this.analyser.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);
        this.source.buffer = audioBuffer;
        this.source.loop = false;
        this.source.start(0);
        this.isPlaying = true;
        this.source.onended = () => {
            this.isPlaying = false;
        };
        // this.gainNode.gain.value = .1;
        return of(true);
    }

    setup(canvas: HTMLCanvasElement): Observable<any> {
        this.canvas = canvas;
        this.drawContext = canvas.getContext('2d');

        return interval(1000 / 60).pipe(
            takeWhile(_ => this.isPlaying),
            map(_ => this.beat()),
        );
    }

    private beat(): any {
        this.analyser.getByteFrequencyData(this.freqs);
        this.analyser.getByteTimeDomainData(this.times);
        const frequencyBinCount = this.analyser.frequencyBinCount;

        const WIDTH = this.canvas.width;
        const HEIGHT = 250;
        const barWidth = WIDTH / frequencyBinCount;
        let x = 0;
        const rowbar = HEIGHT / 15;
        const bar = (WIDTH - 36) / 10;
        this.drawContext.fillStyle = this.theme === 1 ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
        this.drawContext.fillRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < frequencyBinCount; i++) {
            const value = this.freqs[i];
            if (this.theme === 1) {
                this.drawContext.fillStyle = 'rgb(0, 0, 0)';
                this.drawContext.fillRect(x, HEIGHT - value, bar, value);
                x += bar + 4;
                for (let j = 0; j < 15; j++) {
                    this.drawContext.fillStyle = 'rgb(255,255,255)';
                    this.drawContext.fillRect(0, HEIGHT - rowbar * j, WIDTH, 2);
                }
            } else {
                const ROWS = 10, COLS = 10, PADDING = 2;
                const w = WIDTH / COLS;
                const h = HEIGHT / ROWS;

                this.drawContext.fillStyle = 'rgb(255,255,255)';
                for (let j = 1; j < ROWS; j++) {
                    this.drawContext.fillRect(0, h * j, WIDTH, PADDING);
                    this.drawContext.fillRect(w * j, 0, PADDING, HEIGHT);
                }
                const percent = value / 256;
                const height = HEIGHT * percent;
                const offset = HEIGHT - height;
                //   if (beat.timelapse >= 100) { drawContext.fillStyle = 'rgb(0,0,0)'; }
                const n = Math.round(offset / (h - PADDING)) * ROWS + Math.round(i * barWidth / (w - PADDING));
                if (n < ROWS * COLS) {
                    this.drawContext.fillRect((n % COLS) * w, Math.round(n / ROWS) * h, w - 2, h - 2);
                }
            }
        }
        return {
            curr: this.audioCtx.currentTime,
            duration: this.source.buffer.duration
        }
    }

    togglePlay(): Observable<boolean> {
        if (!this.source || !this.source.buffer) return of(false);
        return new Observable((observer) => {
            const promise = this.isPlaying ? this.audioCtx.suspend() : this.audioCtx.resume();
            promise.then(_ => {
                this.isPlaying = !this.isPlaying;
                observer.next(this.isPlaying);
                observer.complete();
            });
        });
    }

    setVolumn(v: number): void {
        this.gainNode.gain.value = v;
    }

    toggleTheme(): void {
        this.theme = this.theme === 1 ? 2 : 1;
    }

    close(): void {
        this.audioCtx.suspend();
        this.source.disconnect(0);
        this.analyser.disconnect(0);
        this.gainNode.disconnect(0);
        // this.audioCtx.close();
    }
}
