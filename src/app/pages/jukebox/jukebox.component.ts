import { Component, OnInit, ElementRef, Renderer2, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Jukebox, Metadata, Beat } from './jukebox.model';
import { BeatService } from './beat.service';
import { JukeService } from './jukebox.service';
import { Subscription } from 'rxjs/internal/Subscription';
declare let window: any;

@Component({
  selector: 'app-jukebox',
  templateUrl: './jukebox.component.html',
  styleUrls: ['./jukebox.component.scss']
})
export class JukeboxComponent implements OnInit, OnDestroy {
  private context: AudioContext;
  private musics =  ['assets/jukebox/musics/iLoveRocknRoll.mp3', 'assets/jukebox/musics/bailando.mp3'];
                      // ,'assets/jukebox/musics/SeuOlharMeChama.mp3'];
  private jukebox: Jukebox;
  private theme = 1;
  private beatSubsription: Subscription;
  private loadSubscription: Subscription;
  private metadataSubscription: Subscription;
  private playingSubscription: Subscription;
  private infoSubscription: Subscription;
  private infos: any;
  metadata: Metadata;
  private isPlaying = false;

  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('progressbar') progressbarRef: ElementRef;
  @ViewChild('lyricDiv') lyricRef: ElementRef;
  @ViewChild('albumDiv') albumRef: ElementRef;
  @ViewChild('playpause') toggleRef: ElementRef;
  private drawContext: CanvasRenderingContext2D;

  constructor(private titleService: Title,
              private beatService: BeatService,
              private el: ElementRef,
              private render: Renderer2,
              private jukeService: JukeService) {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
  }
  ngOnInit() {
    this.titleService.setTitle('Jukebox 1.3');
    document.body.classList.add('loading');
    this.infoSubscription = this.jukeService.getMusicInfo().subscribe(res => {
      if (res && res.length) {
        this.infos = res;
      }
    });

    this.jukebox = new Jukebox(this.context, this.musics, this.beatService);
    this.drawContext = this.canvasRef.nativeElement.getContext('2d');

    this.loadSubscription = this.jukebox.load().subscribe((res: boolean) => {
      document.body.classList.remove('loading');
      this.playMusic(res);
    }, err => { console.log(err); });
    this.metadataSubscription = this.beatService.metadata$.subscribe(m => {
      this.metadata = m;
      // if (m.title) {
      //   this.jukeService.getLyrics(m.artist, m.title).subscribe(res => {
      //     if (res['text']) {
      //       this.lyricArr = res['text'].split('<br>').filter(str => str !== '').map((str, i) => `{${3*i}}${str}`);
      //       console.log(this.lyricArr);
      //     } else {
      //       this.lyric = '  Lyric Not available';
      //     }
      //   });
      // }
    });

    this.playingSubscription = this.beatService.isPlaying$.subscribe(p => {
      this.isPlaying = p;
      this.render[this.isPlaying ? 'addClass' : 'removeClass'](this.toggleRef.nativeElement, 'playing');
    });
  }

  private playMusic(res: boolean) {
    if (res) {
      const HEIGHT = 250;
      let lyrics = [];
      const info = this.infos[this.jukebox.mIndex];
      if (info) {
        lyrics = info.lyrics;
        this.render.setProperty(this.albumRef.nativeElement, 'innerHTML', `<img src=${info.album_url} width='200px' height='200px' />` );
      } else {
        this.render.setProperty(this.lyricRef.nativeElement, 'innerHTML', '  Lyric Not Available');
        this.render.setProperty(this.albumRef.nativeElement, 'innerHTML', ' Album Cover Not Found' );
      }
      this.beatSubsription = this.beatService.getBeat().subscribe( beat => {
        const WIDTH = this.el.nativeElement.querySelector('#conLeft').offsetWidth;
        this.canvasRef.nativeElement.width = WIDTH;
        this.render.setStyle(this.progressbarRef.nativeElement, 'width', beat.timelapse + '%');

        if (lyrics) {
          const lyric = lyrics.filter(str => +str.match(/\d+/)[0] === Math.round(beat.timelapse))[0];
          if (typeof lyric !== 'undefined') {
            this.render.setProperty(this.lyricRef.nativeElement, 'innerHTML', lyric.replace(/{[^}]*}/g, '').replace(/<\/?[^>]+(>|$)/g, ''));
          }
        }
        const barWidth = WIDTH / beat.frequencyBinCount;
        let x = 0;
        const rowbar = HEIGHT / 15;
        const bar = (WIDTH - 36) / 10;
        this.drawContext.fillStyle = this.theme === 1 ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
        this.drawContext.fillRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < beat.frequencyBinCount; i++) {
          const value = beat.freqs[i];

          if (this.theme === 1) {
            this.drawContext.fillStyle = 'rgb(0, 0, 0)';
            if (beat.timelapse >= 100) { console.log(beat.timelapse)
              this.drawContext.fillRect(x, 0 , bar, HEIGHT);
            } else {
              this.drawContext.fillRect(x, HEIGHT - value, bar, value);
            }
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
            if (beat.timelapse >= 100) { this.drawContext.fillStyle = 'rgb(0,0,0)'; }
            const n = Math.round(offset / (h - PADDING)) * ROWS + Math.round(i * barWidth / (w  - PADDING)) ;
            if (n < ROWS * COLS) {
              this.drawContext.fillRect((n % COLS) * w, Math.round(n / ROWS) * h, w - 2, h - 2);
            }
          }

        }
      });
    }
  }
  ngOnDestroy() {
    if (this.infoSubscription) this.infoSubscription.unsubscribe();
    if (this.jukebox) this.jukebox.pause();
    if (this.loadSubscription) this.loadSubscription.unsubscribe();
    if (this.beatSubsription) this.beatSubsription.unsubscribe();
    if (this.playingSubscription) this.playingSubscription.unsubscribe();
    if (this.metadataSubscription) this.metadataSubscription.unsubscribe();
  }

  previous(): void {
    // this.jukebox.previous().subscribe(res => { this.playMusic(res); }, err => console.log(err));
  }

  next(): void {
    // this.jukebox.next().subscribe(res => { this.playMusic(res); }, err => console.log(err));
  }

  changeTheme(): void {
    this.theme = this.theme === 1 ? 2 : 1;
  }

  toggle(): void {
    if (this.isPlaying) {
      this.jukebox.pause();
    } else {
      this.jukebox.start();
    }
  }
  onChangeVolume(value: number) {
    this.jukebox.setVolumn(value);
  }

  onFileUploaded(path: string): void {
    console.log(path);
  }

}
