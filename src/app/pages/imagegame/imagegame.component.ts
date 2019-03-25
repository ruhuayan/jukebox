import { Component, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { Title } from '@angular/platform-browser';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-imagegame',
  templateUrl: './imagegame.component.html',
  styleUrls: ['./imagegame.component.scss']
})
export class ImagegameComponent implements OnInit, OnDestroy {

  img: HTMLImageElement;
  private imgSubscription: Subscription;
  private thumbs: any[];
  private arrows: any[];
  private emptyThumb: any;
  private height = 0;
  private width = 0;
  private row = 3;
  private paused = false;
  numberShow = false;
  numOfCan = Array.from(new Array(this.row * this.row).keys());
  imgs = ['assets/igame/picture_1.jpg', 'assets/igame/picture_2.jpg', 'assets/igame/picture_3.jpg'];
  constructor(private titleService: Title,
              private el: ElementRef,
              private renderer: Renderer2) { }

  ngOnInit() {
    this.titleService.setTitle('Image Game');
    this.arrows = this.el.nativeElement.querySelectorAll('.arrow');
    this.loadImage(this.imgs[0]);
  }

  private loadImage(imageSrc: string): void {
    this.img = new Image();
    this.img.src = imageSrc;
    const self = this;
    this.imgSubscription = new Observable((observer) => {
      this.img.onload = function() {
        const height = self.img.height, width = self.img.width;
        observer.next([width, height]);
      };
    }).subscribe(res => {
      if (res) {
        this.width = res[0];
        this.height = res[1];
        this.setCanvas(this.width, this.height, this.row);
        this.shuffle();
      }
    });
  }

  private setCanvas(imageW: number, imageH: number, row: number): void {
    const th = Math.floor(imageH / row), tw = Math.floor(imageW / row);

    this.thumbs = this.el.nativeElement.querySelectorAll('.canvas-wrap');
    this.emptyThumb = this.el.nativeElement.querySelector('.empty-wrap');
    for (let i = 0; i < this.thumbs.length; i++) {
      this.setThumbStyle(this.thumbs[i], i);
      this.setThumbNumber(this.thumbs[i], i, i);
      const canvas = this.thumbs[i].querySelector('canvas');
      canvas.width = tw;
      canvas.height = th;
      const context = canvas.getContext('2d');
      context.drawImage(this.img, tw * (i % this.row), th * Math.floor(i / this.row),
                                tw, th, 0, 0, tw, th);
    }
    this.setThumbStyle(this.emptyThumb, this.row ** 2);
    this.setThumbNumber(this.emptyThumb, this.row ** 2);
    this.renderer.setStyle(this.emptyThumb, 'width', tw + 'px');
    this.renderer.setStyle(this.emptyThumb, 'height', th + 'px');
    this.setArrowStyle(this.row ** 2);
  }

  private setThumbStyle(thumb: any, i: number): void {
    const th = Math.floor(this.height / this.row), tw = Math.floor(this.width / this.row);
    const marginLeft = i < this.row ** 2 ? (tw + 1) * (i % this.row) : (tw + 1) * this.row;
    const marginTop = i < this.row ** 2 ? (th + 1) * Math.floor(i / this.row) : (th + 1) * (this.row - 1);
    this.renderer.setStyle(thumb, 'margin-left', marginLeft + 'px');
    this.renderer.setStyle(thumb, 'margin-top', marginTop + 'px');
  }

  private setThumbNumber(thumb: any, dataNum: number, dataOri: number = 0): void {
    this.renderer.setAttribute(thumb, 'data-num', dataNum + '');
    if (dataOri) {
      this.renderer.setAttribute(thumb, 'data-ori', dataOri + '');
    }
  }

  private setArrowStyle(num_empty: number): void {
    this.renderer.setStyle(this.arrows[0], 'opacity', num_empty !== this.row ** 2 && num_empty % this.row === 0 ? '0' : '1');
    this.renderer.setStyle(this.arrows[1], 'opacity', num_empty === this.row ** 2 || num_empty < this.row ? '0' : '1');
    this.renderer.setStyle(this.arrows[2], 'opacity', num_empty === this.row ** 2 || num_empty % this.row === this.row - 1 ? '0' : '1');
    this.renderer.setStyle(this.arrows[3], 'opacity', num_empty === this.row ** 2 || Math.floor(num_empty / this.row) === this.row - 1 ? '0' : '1');
  }

  changeImage(index: number): void {
    this.thumbs = [];
    this.loadImage(this.imgs[+index]);
  }

  changeFormat(num: number): void {
    this.numOfCan = [];
    setTimeout(() => {
      this.row = +num;
      this.numOfCan = Array.from(new Array(this.row * this.row).keys());
      setTimeout(() => {
        this.setCanvas(this.width, this.height, this.row);
        this.shuffle();
      } , 100);
    }, 0);
  }
  showNumber(): void {
    this.numberShow = !this.numberShow;
  }
  showImage(): void {
    if (this.paused) { return; }
    this.thumbs.forEach(thumb => {
      this.setThumbStyle(thumb, +thumb.getAttribute('data-ori'));
    });
    this.paused = true;
    setTimeout(() => {
      this.thumbs.forEach(thumb => {
        this.setThumbStyle(thumb, +thumb.getAttribute('data-num'));
      });
      this.paused = false;
    }, 1300);
  }

  shuffle(): void {
    if (this.paused) { return; }
    for (let i = 0; i < this.row ** 2; i++) {
      if (i === this.row ** 2 - 1) {
        break;
      }
      const j = Math.floor(Math.random() * (this.row ** 2));
      const jNum = this.thumbs[j].getAttribute('data-num');
      const iNum = this.thumbs[i].getAttribute('data-num');

      if (iNum !== jNum && j !== this.row ** 2 - 1) {
        this.swap(this.thumbs[i], this.thumbs[j]);
      }
    }
  }
  shift(event: MouseEvent, i: number) {
    if (this.paused) { return; }
    const num_empty = +this.emptyThumb.getAttribute('data-num');
    const index = +this.thumbs[i].getAttribute('data-num');

    if ((num_empty === this.row ** 2 && num_empty - index === 1)
      || (index === this.row ** 2 && num_empty - index === -1)
      || (num_empty - index === 1 && (index + 1) % this.row !== 0 )
      || (num_empty - index === -1 && index % this.row !== 0)
      || (Math.abs(num_empty - index) === this.row && num_empty !== this.row ** 2)) {

      this.swap(this.emptyThumb, this.thumbs[i]);
      if (this.checkGame()) {
        setTimeout(() => alert('you won !!!'), 300);
      }
    }
  }
  private swap(iThumb: any, jThumb: any): void {
    const jNum = jThumb.getAttribute('data-num');
    const iNum = iThumb.getAttribute('data-num');

    this.setThumbStyle(iThumb, jNum);
    this.setThumbNumber(iThumb, jNum);
    this.setThumbStyle(jThumb, iNum);
    this.setThumbNumber(jThumb, iNum);
  }

  private checkGame(): boolean {
    const num_empty = +this.emptyThumb.getAttribute('data-num');

    // show arrows
    this.setArrowStyle(num_empty);
    if (num_empty !== this.row ** 2) {
      return false;
    }
    for (let i = 0; i < this.row ** 2; i++) {
      if (this.thumbs[i].getAttribute('data-ori') !== this.thumbs[i].getAttribute('data-num')) {
        return false;
      }
    }
    return true;
  }

  download(): void {
    const zip = new JSZip();
    zip.file('README.txt', 'Image Game from www.richyan.com \n');
    const img = zip.folder('images');
    this.thumbs.forEach((thumb, i) => {
      const image = thumb.querySelector('canvas').toDataURL('image/png');
      const base64_img = image.split(',')[1];
      img.file(`thumb_${i + 1}.png`, base64_img, {base64: true});
    });
    zip.generateAsync({type: 'blob'})
            .then(function(content) { console.log(content)
                FileSaver.saveAs(content, 'download_from_richyan_com.zip');
            });
  }

  onFileUploaded(path: string): void {
    console.log(path);
  }

  ngOnDestroy() { console.log('image game destroy');
    this.imgSubscription.unsubscribe();
  }

  test(): void {
    const arr = {info: {pc: {js:[1, 2, 3], css: [4, 5, 6]}, tablet: {js: [7,8,9], css: [1,2,3]}}, index:{pc: {js: [0,0,0],css:[1,1,1]}}};

    const count = Object.keys(arr).reduce((acc, cur) =>
        [...acc, ...Object.keys(arr[cur]).reduce((acc1, cur1) =>
            [...acc1, ...Object.keys(arr[cur][cur1]).reduce((acc2, cur2) =>
              [...acc2, ...arr[cur][cur1][cur2].map(file => new Object({file: file, action: cur, platform: cur1, type: cur2}))], [])]
            , [])]
      , []).map(v => { console.log(v.file, v.action, v.platform, v.type); }).length;
    console.log(`${count} files`);
  }
}
