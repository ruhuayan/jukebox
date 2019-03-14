import { Component, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-imagegame',
  templateUrl: './imagegame.component.html',
  styleUrls: ['./imagegame.component.scss']
})
export class ImagegameComponent implements OnInit {

  img: HTMLImageElement;
  private thumbs: any[];
  private emptyThumb: any;
  private imageWrap: any;
  private height = 0;
  private width = 0;
  private row = 3;
  numberShow = false;
  imageShow = false;
  numOfCan = Array.from(new Array(this.row * this.row).keys());
  imgs = ['assets/igame/picture_1.jpg', 'assets/igame/picture_2.jpg', 'assets/igame/picture_3.jpg'];
  constructor(private el: ElementRef,
              private renderer: Renderer2) { }

  ngOnInit() {
    this.loadImage(this.imgs[0]);
  }

  private loadImage(imageSrc: string): void {
    this.img = new Image();
    this.img.src = imageSrc;
    const self = this;
    new Observable((observer) => {
      this.img.onload = function() {
        const height = self.img.height, width = self.img.width;
        observer.next([width, height]);
      };
    }).subscribe(res => {
      if (res) { console.log(res);
        this.width = res[0];
        this.height = res[1];
        this.setCanvas(this.width, this.height, this.row);
        this.shuffle();
      }
    });
  }

  private setCanvas(imageW: number, imageH: number, row: number):void {
    const th = Math.floor(imageH / row), tw = Math.floor(imageW / row);

    this.thumbs = this.el.nativeElement.querySelectorAll('.canvas-wrap');
    this.emptyThumb = this.el.nativeElement.querySelector('.empty-wrap');
    for (let i = 0; i < this.thumbs.length; i++) {
      const marginLeft = (tw + 1) * (i % row);
      const marginTop = (th + 1) * Math.floor(i / row);
      this.renderer.setStyle(this.thumbs[i], 'margin-left', marginLeft + 'px');
      this.renderer.setStyle(this.thumbs[i], 'margin-top', marginTop + 'px');
      this.renderer.setAttribute(this.thumbs[i], 'data-margin-left', marginLeft + '');
      this.renderer.setAttribute(this.thumbs[i], 'data-margin-top', marginTop + '');
      this.renderer.setAttribute(this.thumbs[i], 'data-num', i + '');
      this.renderer.setAttribute(this.thumbs[i], 'data-ori', i + '');
      const eMarginLeft =  (tw + 1) * row;
      const eMarginTop = (th + 1) * (row - 1);
      this.renderer.setStyle(this.emptyThumb, 'margin-top', eMarginTop + 'px');
      this.renderer.setStyle(this.emptyThumb, 'margin-left', eMarginLeft + 'px');
      this.renderer.setStyle(this.emptyThumb, 'width', tw + 'px');
      this.renderer.setStyle(this.emptyThumb, 'height', th + 'px');
      this.renderer.setAttribute(this.emptyThumb, 'data-margin-left', eMarginLeft + '');
      this.renderer.setAttribute(this.emptyThumb, 'data-margin-top', eMarginTop + '');
      this.renderer.setAttribute(this.emptyThumb, 'data-num', row ** 2 + '');
      const canvas = this.thumbs[i].querySelector('canvas');
      canvas.width = tw;
      canvas.height = th;
      const context = canvas.getContext('2d');
      context.drawImage(this.img, tw * (i % this.row), th * Math.floor(i / this.row),
                                tw, th, 0, 0, tw, th);
    }
  }

  changeImage(index: number): void {
    this.thumbs = [];
    this.loadImage(this.imgs[+index]);
  }

  changeFormat(num: number): void {
    this.numOfCan = [];
    setTimeout(() => {
      this.row = +num;
      this.numOfCan = Array.from(new Array(this.row * this.row).keys())
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
    this.imageShow = !this.imageShow;
    if (this.imageShow) {
      setTimeout(() => {
        this.imageWrap = this.el.nativeElement.querySelector('.image-wrap');
        this.renderer.setStyle(this.imageWrap, 'margin-left', (this.width + this.row)  + 'px');
        setTimeout(() => this.imageShow = false, 2000);
      }, 200);
    }
  }
  shuffle(): void {
    // if (this.thumbs.length === 0 && this.thumbs.length !== this.row ** 2) {
    //   return;
    // }
    for (let i = 0; i < this.row ** 2; i++) {
      if (i === this.row ** 2 - 1) {
        break;
      }
      const j = Math.floor(Math.random() * (this.row ** 2));
      const jNum = this.thumbs[j].getAttribute('data-num');
      const iNum = this.thumbs[i].getAttribute('data-num');

      if (iNum !== jNum && j !== this.row ** 2 - 1) {
        this.swap(this.thumbs[i], this.thumbs[j])
      }
    }
  }
  shift(event: MouseEvent, i: number) { 
    const num_empty = +this.emptyThumb.getAttribute('data-num');
    const index = +this.thumbs[i].getAttribute('data-num');

    if ((num_empty === this.row ** 2 && num_empty - index === 1)
      || (index === this.row ** 2 && num_empty - index === -1)
      || (num_empty - index === 1 && (index + 1) % this.row !== 0 )
      || (num_empty - index === -1 && index % this.row !== 0)
      || (Math.abs(num_empty - index) === this.row && num_empty !== this.row ** 2)) {

      this.swap(this.emptyThumb, this.thumbs[i]);
    }

    if (this.checkGame()) {
      setTimeout(() => alert('you won !!!'), 300);;
    }
  }
  private swap(iThumb: any, jThumb: any): void {
    const jNum = jThumb.getAttribute('data-num');
    const iNum = iThumb.getAttribute('data-num');
    const iMarginLeft = iThumb.getAttribute('data-margin-left');
    const iMarginTop = iThumb.getAttribute('data-margin-top');
    const jMarginLeft = jThumb.getAttribute('data-margin-left');
    const jMarginTop = jThumb.getAttribute('data-margin-top');

    this.renderer.setStyle(iThumb, 'margin-left', jMarginLeft + 'px');
    this.renderer.setStyle(iThumb, 'margin-top', jMarginTop + 'px');
    this.renderer.setAttribute(iThumb, 'data-margin-left', jMarginLeft);
    this.renderer.setAttribute(iThumb, 'data-margin-top', jMarginTop);
    this.renderer.setAttribute(iThumb, 'data-num', jNum);

    this.renderer.setStyle(jThumb, 'margin-left', iMarginLeft + 'px');
    this.renderer.setStyle(jThumb, 'margin-top', iMarginTop + 'px');
    this.renderer.setAttribute(jThumb, 'data-margin-left', iMarginLeft);
    this.renderer.setAttribute(jThumb, 'data-margin-top', iMarginTop);
    this.renderer.setAttribute(jThumb, 'data-num', iNum);
  }

  private checkGame(): boolean {
    const num_empty = +this.emptyThumb.getAttribute('data-num');
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

  }
}
