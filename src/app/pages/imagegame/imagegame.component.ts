import { Component, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-imagegame',
  templateUrl: './imagegame.component.html',
  styleUrls: ['./imagegame.component.scss']
})
export class ImagegameComponent implements OnInit {

  private img: HTMLImageElement;
  private thumbs: any[];
  private emptyThumb: any;
  private tHeight = 0;
  private tWidth = 0;
  private row = 3;
  numberShow = false;
  numOfCan = Array.from(new Array(this.row * this.row).keys());
  imgs = ['assets/igame/picture_1.jpg', 'assets/igame/picture_2.jpg', 'assets/igame/picture_3.jpg'];
  constructor(private el: ElementRef,
              private renderer: Renderer2) { }

  ngOnInit() {
    this.img = new Image();
    this.img.src = this.imgs[0];
    const self = this;
    new Observable((observer) => {
      this.img.onload = function() {
        const height = self.img.height, width = self.img.width;
        const sh = Math.round(height / self.row), sw = Math.round(width / self.row);
        observer.next([sw, sh]);
      };
    }).subscribe(res => {
      if (res) { console.log(res);
        this.tWidth = res[0];
        this.tHeight = res[1];

        this.thumbs = this.el.nativeElement.querySelectorAll('.canvas-wrap');
        this.emptyThumb = this.el.nativeElement.querySelector('.empty-wrap');
        for (let i = 0; i < this.thumbs.length; i++) {
          const marginLeft = (res[0] + 1) * (i % this.row);
          const marginTop = (res[1] + 1) * Math.floor(i / this.row);
          this.renderer.setStyle(this.thumbs[i], 'margin-left', marginLeft + 'px');
          this.renderer.setStyle(this.thumbs[i], 'margin-top', marginTop + 'px');
          this.renderer.setAttribute(this.thumbs[i], 'data-margin-left', marginLeft + '');
          this.renderer.setAttribute(this.thumbs[i], 'data-margin-top', marginTop + '');

          const eMarginLeft =  (res[0] + 1) * this.row;
          const eMarginTop = (res[1] + 1) * (this.row - 1);
          this.renderer.setStyle(this.emptyThumb, 'margin-top', eMarginTop + 'px');
          this.renderer.setStyle(this.emptyThumb, 'margin-left', eMarginLeft + 'px');
          this.renderer.setStyle(this.emptyThumb, 'width', res[0] + 'px');
          this.renderer.setStyle(this.emptyThumb, 'height', res[1] + 'px');
          this.renderer.setAttribute(this.emptyThumb, 'data-margin-left', eMarginLeft + '');
          this.renderer.setAttribute(this.emptyThumb, 'data-margin-top', eMarginTop + '');
          this.renderer.setAttribute(this.emptyThumb, 'data-num', this.row ** 2 + '');
          const canvas = this.thumbs[i].querySelector('canvas');
          canvas.width = this.tWidth;
          canvas.height = this.tHeight;
          const context = canvas.getContext('2d');
          context.drawImage(this.img, res[0] * (i % this.row), res[1] * Math.floor(i / this.row),
                                    res[0], res[1], 0, 0, res[0], res[1]);
        }
        this.shuffle();
      }
    });

  }
  showNumber(): void {
    this.numberShow = !this.numberShow;
  }
  showImage(): void {
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
  shift(event: MouseEvent, index: number) {
    const num_empty = this.emptyThumb.getAttribute('data-num'); console.log(num_empty);
    if (Math.abs(num_empty - index) === this.row) {
      this.swap(this.emptyThumb, this.thumbs[index]);
    } else if (Math.abs(num_empty - index) === 1) {
      this.swap(this.emptyThumb, this.thumbs[index]);
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
  download(): void {

  }
}
