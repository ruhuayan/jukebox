import { Component, OnInit, ElementRef, Renderer2, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Metadata } from './model/metadata.interface';
import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { IJukeboxState } from './state/jukebox.reducer';
import * as jukeboxActions from './state/jukebox.actions';
import { LoaderService } from './model/loader.service';
import { Info } from './model/info.interface';

@Component({
  selector: 'app-jukebox',
  templateUrl: './jukebox.component.html',
  styleUrls: ['./jukebox.component.scss']
})
export class JukeboxComponent implements OnInit, OnDestroy {

  private musics = ['assets/jukebox/musics/iLoveRocknRoll.mp3', 'assets/jukebox/musics/bailando.mp3'];
  private subscriptions: Subscription = new Subscription();
  info: Info;
  metadata: Metadata = { title: '' };
  isLoading = false;
  isPlaying = false;
  // lyric = 'Music Loading, please wait....';

  @ViewChild('canvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('progressbar', { static: true }) progressbarRef: ElementRef<HTMLElement>;
  @ViewChild('lyricDiv', { static: true }) lyricRef: ElementRef<HTMLElement>;
  constructor(
    private titleService: Title,
    private store: Store<IJukeboxState>,
    private loadService: LoaderService,
    private render: Renderer2
  ) {
    this.store.dispatch(new jukeboxActions.LoadInfos());
    this.store.dispatch(new jukeboxActions.LoadMusic(this.musics[1]));
  }
  ngOnInit() {
    this.titleService.setTitle('Jukebox - richyan.com');

    const sbt = this.store.pipe(select('iJukeboxState')).subscribe(state => {

      this.isLoading = state.loading;
      this.isPlaying = state.isPlaying;
      if (state.loaded) {
        this.info = state.infos[1];
        const lyrics = this.info?.lyrics;

        this.loadService.setup(this.canvasRef.nativeElement).subscribe(res => {
          let percent = res.curr * 100 / res.duration;
          percent = percent < 100 ? percent : 100;
          this.render.setStyle(this.progressbarRef.nativeElement, 'width', `${percent}%`);

          if (lyrics) {
            const lyric = lyrics.filter(str => +str.match(/\d+/)[0] === Math.round(res.curr))[0];
            if (lyric) {
              this.render.setProperty(this.lyricRef.nativeElement, 'innerHTML', lyric.replace(/{[^}]*}/g, '').replace(/<\/?[^>]+(>|$)/g, ''));
            }
          }

        });
      }
    });
    this.subscriptions.add(sbt);
    this.togglePlay();

  }

  ngOnDestroy() {
    this.loadService.close();
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }

  previous(): void {
  }

  next(): void {
  }

  changeTheme(): void {
    this.loadService.toggleTheme();
  }

  togglePlay(): void {
    this.store.dispatch(new jukeboxActions.TogglePlay());
  }
  onChangeVolume(value: number) {
    this.loadService.setVolumn(value);
  }

  onFileUploaded(path: string): void {
    console.log(path);
  }

}
