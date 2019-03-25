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
    this.infoSubscription = this.jukeService.getMusicInfo().subscribe(res => {
      if (res && res.length) {
        this.infos = res;
      }
    });

    this.jukebox = new Jukebox(this.context, this.musics, this.beatService);
    this.drawContext = this.canvasRef.nativeElement.getContext('2d');

    this.loadSubscription = this.jukebox.load().subscribe((res: boolean) => {
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
    const toggle = this.el.nativeElement.querySelector('#toggle');
    this.playingSubscription = this.beatService.isPlaying$.subscribe(p => {
      this.isPlaying = p;
      this.render[this.isPlaying ? 'addClass' : 'removeClass'](toggle, 'playing');
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
        this.drawContext.fillStyle = 'rgb(255, 255, 255)';
        this.drawContext.fillRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < beat.frequencyBinCount; i++) {
          const value = beat.freqs[i];

          this.drawContext.fillStyle = 'rgb(0, 0, 0)';
          this.drawContext.fillRect(x, HEIGHT - value, bar, value);
          if (this.theme === 1) {
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
            for(let j = 1; j < ROWS; j++) {
                this.drawContext.fillRect(0, h * j, WIDTH, PADDING);
                this.drawContext.fillRect(w * j, 0, PADDING, HEIGHT);
            }
            const percent = value / 256;
            const height = HEIGHT * percent;
            const offset = HEIGHT - height;
            const j = Math.round(offset / (h - PADDING)) * ROWS + Math.round(i * barWidth / (w  - PADDING)) ;
            if(j < ROWS * COLS) {
              this.drawContext.fillRect((j % COLS) * w, Math.round(j / ROWS) * h, w - 2, h - 2);
            }
          }

        }
      });
    }
  }
  ngOnDestroy() {
    this.infoSubscription.unsubscribe();
    this.jukebox.pause();
    this.loadSubscription.unsubscribe();
    this.beatSubsription.unsubscribe();
    this.playingSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
  }

  previous(): void {
    this.jukebox.previous().subscribe(res => { this.playMusic(res); }, err => console.log(err));
  }

  next(): void {
    this.jukebox.next().subscribe(res => { this.playMusic(res); }, err => console.log(err));
  }

  changeTheme(): void {

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
