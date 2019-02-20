import { Component, OnInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Jukebox, Metadata } from './jukebox.model';
import { BeatService } from './beat.service';
import { JukeService } from './jukebox.service';
import { Subscription } from 'rxjs/internal/Subscription';
declare let window: any;
import './string.extensions';
@Component({
  selector: 'app-points',
  templateUrl: './jukebox.component.html',
  styleUrls: ['./jukebox.component.scss']
})
export class JukeboxComponent implements OnInit, OnDestroy {
  private context: AudioContext;
  private musics =  ['assets/jukebox/musics/iLoveRocknRoll.mp3', 'assets/jukebox/musics/bailando.mp3',
                      'assets/jukebox/musics/SeuOlharMeChama.mp3'];
  private jukebox: Jukebox;
  private canvas: any;
  private drawContext: any;
  private beatSubsription: Subscription;
  private loadSubscription: Subscription;
  private metadataSubscription: Subscription;
  private playingSubscription: Subscription;
  metadata: Metadata;
  lyric = 'Music Loading, please wait....';
  isPlaying = false;
  lyricArr: string[];
  constructor(private titleService: Title,
              private beatService: BeatService,
              private el: ElementRef,
              private render: Renderer2,
              private jukeService: JukeService) {
    this.titleService.setTitle('Jukebox - music player');
    this.context = new (window.AudioContext || window.webkitAudioContext)();
  }
  ngOnInit() {
    this.jukebox = new Jukebox(this.context, this.musics, this.beatService);
    this.canvas = this.el.nativeElement.querySelector('#canvas');
    this.drawContext = this.canvas.getContext('2d');
    const progressbar = this.el.nativeElement.querySelector('#myBar');
    const lyricDiv = this.el.nativeElement.querySelector('#conSubTitle');

    const WIDTH = 570, HEIGHT = 250;
    this.loadSubscription = this.jukebox.load().subscribe((res) => {
      if (res) {

        this.beatSubsription = this.beatService.getBeat().subscribe( beat => {

          this.render.setStyle(progressbar, 'width', beat.timelapse + '%');
          if (this.lyricArr) {
            const lyric = this.lyricArr.filter(str => +str.match(/\d+/)[0] === Math.round(beat.timelapse))[0];
            if (typeof lyric !== 'undefined') {
              this.render.setProperty(lyricDiv, 'innerHTML', lyric.replace(/{[^}]*}/g,'').replace(/<\/?[^>]+(>|$)/g, ''));
            }
          }
          // const barWidth = WIDTH / beat.frequencyBinCount;
          let x = 0;
          this.drawContext.fillStyle = 'rgb(255, 255, 255)';
          this.drawContext.fillRect(0, 0, WIDTH, HEIGHT);
          for (let i = 0; i < beat.frequencyBinCount; i++) {

            const value = beat.freqs[i];
            const bar = (WIDTH - 36) / 10;

            this.drawContext.fillStyle = 'rgb(0, 0, 0)';
            this.drawContext.fillRect(x, HEIGHT - value, bar, value);
            x += bar + 4;
            const rowbar = HEIGHT / 15;
            for (let j = 0; j < 15; j++) {
                this.drawContext.fillStyle = 'rgb(255,255,255)';
                this.drawContext.fillRect(0, HEIGHT - rowbar * j, WIDTH, 2);
            }
          }
        });
      }
    }, err => {});
    this.metadataSubscription = this.beatService.metadata$.subscribe(m => {
      this.metadata = m;
      if (m.title) {
        this.jukeService.getLyrics(m.artist, m.title).subscribe(res => {

          if (res['text']) {
            this.lyricArr = res['text'].split('<br>').filter(str => str !== '').map((str, i) => `{${3*i}}${str}`);
            console.log(this.lyricArr);
          } else {
            this.lyric = '  Lyric Not available';
          }
        });
      }
    });
    this.playingSubscription = this.beatService.isPlaying$.subscribe(p => { console.log(this.isPlaying)
      this.isPlaying = p;
    });
  }
  ngOnDestroy() { console.log('destroy')
    this.jukebox.pause();
    this.loadSubscription.unsubscribe();
    this.beatSubsription.unsubscribe();
    this.playingSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
  }

  previous(): void {

  }
  toggle(): void {
    if (this.isPlaying) {
      this.jukebox.pause();
    } else this.jukebox.start();
  }
}
