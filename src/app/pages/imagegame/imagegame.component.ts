import { Component, OnInit, OnDestroy, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { tap, delay, take } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';

class Dimension {
    width: number;
    height: number;
    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;
    }
}

@Component({
    selector: 'app-imagegame',
    templateUrl: './imagegame.component.html',
    styleUrls: ['./imagegame.component.scss']
})
export class ImagegameComponent implements OnInit, OnDestroy {

    @ViewChild('conLeft', {static: true}) conLeft: ElementRef;
    img: HTMLImageElement;
    private imgSubscription: Subscription;
    private thumbs: any[];
    private arrows: any[];
    private emptyThumb: any;
    private height = 0;
    private width = 0;
    private tw = 0;
    private th = 0;
    public row = 5;
    private paused = false;
    private contextRect: ClientRect;
    numberShow = false;
    numOfCan = Array.from(new Array(this.row * this.row).keys());
    loaded = false;
    imgs = ['assets/igame/picture_1.jpg', 'assets/igame/picture_2.jpg', 'assets/igame/picture_3.jpg'];
    constructor(private titleService: Title,
                private el: ElementRef,
                private renderer: Renderer2) { }

    ngOnInit() {
        this.titleService.setTitle('Image Game - richyan.com');
        this.arrows = this.el.nativeElement.querySelectorAll('.arrow');
        this.loadImage(this.imgs[0]);
        this.contextRect = this.conLeft.nativeElement.getBoundingClientRect();
    }

    private loadImage(imageSrc: string): void {
        this.img = new Image();
        this.img.src = imageSrc;
        const self = this;
        this.imgSubscription = new Observable((observer) => {
            this.img.onload = () => {
                observer.next(new Dimension(self.img.width, self.img.height));
            };
        }).subscribe((res: Dimension) => {
            if (res) {
                this.width = res.width;
                this.height = res.height;
                this.setCanvas(this.width, this.height, this.row);
                this.shuffle();
                this.loaded = true;
            }
        });
    }

    private setCanvas(imageW: number, imageH: number, row: number): void {
        // crop image if image is bigger than context Element
        let iw = imageW, ih = imageH, sl = 0, st = 0;
        if (imageW > this.contextRect.width - this.row) {
            iw = this.contextRect.width - this.row;
            sl = (imageW - iw) / 2;
        }
        if (imageH > this.contextRect.height - this.row) {
            ih = this.contextRect.height - this.row;
            st = (imageH - ih) / 2;
        }
    
        this.th = Math.floor(ih / row), this.tw = Math.floor(iw / row);

        this.thumbs = this.el.nativeElement.querySelectorAll('.canvas-wrap');
        this.emptyThumb = this.el.nativeElement.querySelector('.empty-wrap');
        for (let i = 0; i < this.thumbs.length; i++) {
            this.setThumbStyle(this.thumbs[i], i);
            this.setThumbNumber(this.thumbs[i], i, i);
            const canvas = this.thumbs[i].querySelector('canvas');
            canvas.width = this.tw;
            canvas.height = this.th;
            const context = canvas.getContext('2d');
            context.drawImage(this.img, sl + this.tw * (i % this.row), st + this.th * Math.floor(i / this.row),
                                    this.tw, this.th, 0, 0, this.tw, this.th);
        }
        this.setThumbStyle(this.emptyThumb, this.row ** 2);
        this.setThumbNumber(this.emptyThumb, this.row ** 2);
        this.renderer.setStyle(this.emptyThumb, 'width', this.tw + 'px');
        this.renderer.setStyle(this.emptyThumb, 'height', this.th + 'px');
        this.setArrowStyle(this.row ** 2);
    }

    private setThumbStyle(thumb: any, i: number): void {
        
        const marginLeft = i < this.row ** 2 ? (this.tw + 1) * (i % this.row) :
        this.contextRect.width < 400 ? (this.tw + 1) * (this.row - 1) : (this.tw + 1) * this.row;
        const marginTop = i < this.row ** 2 ? (this.th + 1) * Math.floor(i / this.row) :
        this.contextRect.width < 400 ? (this.th + 1) * this.row : (this.th + 1) * (this.row - 1);
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
        this.loaded = false;
        this.loadImage(this.imgs[+index]);
    }

    changeFormat(num: number): void {
        this.loaded = false;
        of(true).pipe(
            take(1),
            delay(0),
            tap(_ => {
                this.row = +num;
                this.numOfCan = Array.from(new Array(this.row * this.row).keys());
            }),
            delay(100),
            tap(_ => {
                this.setCanvas(this.width, this.height, this.row);
                this.shuffle();
            })
        ).subscribe(_ => {
            this.loaded = true;
        });
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
        this.loaded = false;
        of(true).pipe(
            take(1),
            delay(1000),
            tap(_ => {
                this.thumbs.forEach(thumb => {
                    this.setThumbStyle(thumb, +thumb.getAttribute('data-num'));
                });
                this.paused = false;
                this.loaded = true;
            }),
        ).subscribe();
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
                .then(function(content) {
                    FileSaver.saveAs(content, 'download_from_richyan_com.zip');
                });
    }

    onFileUploaded(path: string): void {
        if (path) {
            this.loadImage(path);
            this.imgs.push(path);
        }
    }

    ngOnDestroy() {
        if (this.imgSubscription) this.imgSubscription.unsubscribe();
    }
}
