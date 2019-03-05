import { Component, OnInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Jukebox, Metadata } from './jukebox.model';
import { BeatService } from './beat.service';
import { JukeService } from './jukebox.service';
import { Subscription } from 'rxjs/internal/Subscription';
declare let window: any;
import './string.extensions';
@Component({
  selector: 'app-jukebox',
  templateUrl: './jukebox.component.html',
  styleUrls: ['./jukebox.component.scss']
})
export class JukeboxComponent implements OnInit, OnDestroy {
  private context: AudioContext;
  private musics =  ['assets/jukebox/musics/iLoveRocknRoll.mp3', 'assets/jukebox/musics/bailando.mp3',
                      'assets/jukebox/musics/SeuOlharMeChama.mp3'];
  private jukebox: Jukebox;
  private theme = 1; 
  private beatSubsription: Subscription;
  private loadSubscription: Subscription;
  private metadataSubscription: Subscription;
  private playingSubscription: Subscription;
  private infoSubscription: Subscription;
  private infos: any;
  metadata: Metadata;
  isPlaying = false;

  file: File = null;
  public progressPercentage: number = 0;
  constructor(private titleService: Title,
              private beatService: BeatService,
              private el: ElementRef,
              private render: Renderer2,
              private jukeService: JukeService) {
    this.titleService.setTitle('Jukebox - music player');
    this.context = new (window.AudioContext || window.webkitAudioContext)();
  }
  ngOnInit() {
    this.infoSubscription = this.jukeService.getMusicInfo().subscribe(res => {
      if (res && res.length) {
        this.infos = res;
      }
    });
    this.jukebox = new Jukebox(this.context, this.musics, this.beatService);
    const canvas = this.el.nativeElement.querySelector('#canvas');
    const drawContext = canvas.getContext('2d');
    const progressbar = this.el.nativeElement.querySelector('#myBar');
    const lyricDiv = this.el.nativeElement.querySelector('#conSubTitle');
    const albumDiv = this.el.nativeElement.querySelector('#album');

    const HEIGHT = 250, WIDTH = 570;
    this.loadSubscription = this.jukebox.load().subscribe((res) => {
      if (res) {
        let lyrics = []; 
        const info = this.infos[this.jukebox.mIndex];
        if (info) {
          lyrics = info.lyrics;
          this.render.setProperty(albumDiv, 'innerHTML', `<img src=${info.album_url} width="200px" height="200px" />` );
        } else {
          this.render.setProperty(lyricDiv, 'innerHTML', '  Lyric Not Available');
          this.render.setProperty(albumDiv, 'innerHTML', ' Album Cover Not Found' );
        }
        this.beatSubsription = this.beatService.getBeat().subscribe( beat => {    // console.log(beat.timelapse);
          // const WIDTH = canvas.offsetWidth; console.log(WIDTH);
          this.render.setStyle(progressbar, 'width', beat.timelapse + '%');
          
          if (lyrics) {
            const lyric = lyrics.filter(str => +str.match(/\d+/)[0] === Math.round(beat.timelapse))[0];
            if (typeof lyric !== 'undefined') {
              this.render.setProperty(lyricDiv, 'innerHTML', lyric.replace(/{[^}]*}/g,'').replace(/<\/?[^>]+(>|$)/g, ''));
            }
          }
          const barWidth = WIDTH / beat.frequencyBinCount;
          let x = 0;
          const rowbar = HEIGHT / 15;
          const bar = (WIDTH - 36) / 10;
          drawContext.fillStyle = 'rgb(255, 255, 255)';
          drawContext.fillRect(0, 0, WIDTH, HEIGHT);

          for (let i = 0; i < beat.frequencyBinCount; i++) {
            const value = beat.freqs[i];
            
            drawContext.fillStyle = 'rgb(0, 0, 0)';
            drawContext.fillRect(x, HEIGHT - value, bar, value);
            if (this.theme === 1) {
              x += bar + 4;
              for (let j = 0; j < 15; j++) {
                  drawContext.fillStyle = 'rgb(255,255,255)';
                  drawContext.fillRect(0, HEIGHT - rowbar * j, WIDTH, 2);
              }
              
            } else {
              const ROWS = 10, COLS = 10, PADDING = 2;
              const w = WIDTH / COLS; 
              const h = HEIGHT / ROWS;
              
              drawContext.fillStyle = "rgb(255,255,255)";
              for(let j = 1; j < ROWS; j++) {
                  drawContext.fillRect(0, h*j, WIDTH, PADDING);
                  drawContext.fillRect(w*j, 0, PADDING, HEIGHT);
              }           
              const percent = value / 256;
              const height = HEIGHT * percent;
              const offset = HEIGHT - height;
              const j = Math.round(offset / (h - PADDING)) * ROWS + Math.round(i * barWidth / (w  -PADDING)) ;
              if(j < ROWS * COLS) 
                  drawContext.fillRect((j%COLS)*w, Math.round(j / ROWS)*h, w-2, h-2);     
            }
            
          }
        });
      }
    }, err => {});
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
    this.playingSubscription = this.beatService.isPlaying$.subscribe(p => { // console.log(this.isPlaying)
      this.isPlaying = p;
    });
  }
  ngOnDestroy() { console.log('destroy')
    this.infoSubscription.unsubscribe();
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

  onFileSelected(event: MouseEvent){ console.log(event);
    if (event['file']) {
      this.file = event['file'];
      if (this.file['error']) {
        setTimeout(() => {
          delete this.file['error'];
        }, 2000);
      } else {
        this.upload(this.file);
        this.file['isUploading'] = true;
      }
      
    }
  }
  private upload(file:File) {
    
  }
}
