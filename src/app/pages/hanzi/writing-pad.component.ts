import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { Loader, Matcher, Point } from './lib';
import { Subscription } from 'rxjs';
import * as createjs from 'createjs-module';

const DASH = 2, MIN = 6, LINE = 10, VAR_MIN = 16, VAR_MAX = 64, ZOOM = 1;

@Component({
    selector: 'app-writing-pad',
    template: `
    <div class="wrapper"><canvas class=" sketch" height="512" width="512" #pad></canvas></div>
    <div class="controls" [ngClass]="{'disabled': !strokes.length}">
        
        <button class="btn clear-btn" (click)="clear()"><img src="/assets/hanzi/clear.svg" /></button>
        <button class="btn undo-btn" (click)="undo()"><img src="/assets/hanzi/undo.svg" /></button>
    </div>`,
    // styleUrls: ['./hanzi.component.scss']
})
export class WritingPadComponent implements OnInit, OnDestroy {
    @ViewChild('pad', { static: true }) pad: ElementRef;
    @Input('loader') loader: Loader;
    @Output() matched = new EventEmitter<string[]>();
    private subscription: Subscription;
    private container: createjs.Container;
    private stage: createjs.Stage;
    private width = 10;
    private midpoint: Point;
    private shape: createjs.Shape;
    private stroke: Point[];
    private dragging = false;
    private stageWidth: number;
    private stageHeight: number;
    private matcher: Matcher;
    private padRect: ClientRect;
    private hanziList = [];
    strokes = [];

    constructor() {
        this.stageWidth = 512;
        this.stageHeight = 512;
    }

    ngOnInit(): void {

        this.subscription = this.loader.data$.subscribe(res => {
            this.matcher = new Matcher(res);
        });
        this.container = new createjs.Container;
        const canvas = this.pad.nativeElement;
        this.padRect = canvas.getBoundingClientRect();
        this.stage = new createjs.Stage(canvas);

        this.addBackground();
        this.stage.addChild(this.container);
        this.reset();
    }

    clear(): void {
        if (this.strokes.length) {
            this.container.removeAllChildren(),
                this.strokes = [];
            this.hanziList = [];
            this.reset();
            this.matched.emit([])
        }
    }

    undo(): void {
        if (this.strokes.length) {
            this.container.removeChildAt(this.container.children.length - 1),
                this.reset();

            if (this.strokes.length == this.hanziList.length) {
                this.hanziList.pop();
            }
            this.strokes.pop()
            const res = this.hanziList.pop();
            this.matched.emit(res);
        }
    }

    close(): void {

    }

    @HostListener('mousedown', ['$event'])
    @HostListener('touchstart', ['$event'])
    onStart(event: any) {
        event.preventDefault();
        this.dragging = !0;
        let point: Point;
        if (event.touches) {
            point = new Point(event['touches'][0]['clientX'] - this.padRect.left, event['touches'][0]['clientY'] - this.padRect.top);
        } else {
            point = new Point(event.clientX - this.padRect.left, event.clientY - this.padRect.top)
        }
        this._pushPoint(point)
    }

    @HostListener('document:mousemove', ['$event'])
    @HostListener('document:touchmove', ['$event'])
    onMove(event: any) {
        event.preventDefault();
        if (!this.dragging) {
            return;
        }
        let point: Point;

        if (event.touches) {
            point = new Point(event['touches'][0]['clientX'] - this.padRect.left, event['touches'][0]['clientY'] - this.padRect.top);
        } else {
            point = new Point(event.clientX - this.padRect.left, event.clientY - this.padRect.top); // console.log(point)
        }

        this._pushPoint(point);
    }

    @HostListener('document:mouseup', ['$event'])
    @HostListener('document:touchend', ['$event'])
    onEnd(event: any) {

        // document:touchend cause other buttons malfuntion
        // if $this not dragging, return to regular click event
        if (!this.dragging) {
            return;
        }
        event.preventDefault();
        this.dragging = !1;
        if (this.stroke.length > 1) {
            this._endStroke();
            const result = this.matcher.match(this.strokes, 8);
            this.hanziList.push(result);
            this.matched.emit(result);
        } else {
            this.reset();
        }

    }

    private addBackground(): void {
        var con = new createjs.Container;
        con.addChild(this.line({ x: 0, y: 0 }, { x: this.stageWidth, y: this.stageHeight })),
            con.addChild(this.line({ x: this.stageWidth, y: 0 }, { x: 0, y: this.stageHeight })),
            con.addChild(this.line({ x: this.stageWidth / 2, y: 0 }, { x: this.stageWidth / 2, y: this.stageHeight })),
            con.addChild(this.line({ x: 0, y: this.stageHeight / 2 }, { x: this.stageWidth, y: this.stageHeight / 2 })),
            con.cache(0, 0, this.stageWidth, this.stageHeight),
            this.stage.addChild(con)
    }

    private line(p1: Point, p2: Point): createjs.Shape {
        var shape = new createjs.Shape;
        shape.graphics.setStrokeDash([DASH, DASH], 0),
            shape.graphics.setStrokeStyle(DASH),
            shape.graphics.beginStroke("#ccc"),
            shape.graphics.moveTo(p1.x, p1.y),
            shape.graphics.lineTo(p2.x, p2.y);
        return shape;
    }

    private reset(): any {
        this.midpoint = null,
            this.shape = null,
            this.stroke = [],
            this.width = LINE,
            this.stage.update()
    }

    private distance(p1: Point, p2: Point): number {
        const e = this.stageWidth * this.stageWidth + this.stageHeight * this.stageHeight,
            n = new Point(p1.x - p2.x, p1.y - p2.y);
        return (n.x * n.x + n.y * n.y) / e;
    }
    private draw(p1: Point, p2: Point, p3: Point = null): void {
        const graphics = this.shape.graphics;
        graphics.setStrokeStyle(this.width, "round"),
            graphics.beginStroke("black"),
            graphics.moveTo(p1.x, p1.y),
            // graphics.moveTo(t[0], t[1]),
            p3 ? graphics.curveTo(p3.x, p3.y, p2.x, p2.y) : graphics.lineTo(p2.x, p2.y),
            this.stage.update();
    }

    private _endStroke(): void { // console.log(this.stroke);
        this.shape && ( //this.callback(this.stroke),
            this.shape.cache(0, 0, this.stageWidth, this.stageHeight)),
            this.strokes.push(this.stroke);
        this.reset();
    }
    // private _maybePushPoint(p: Point): void {
    //     0 === this.stroke.length && this._pushPoint(p)
    // }

    private _pushPoint(p: Point): any {
        if (p.x != null && p.y != null) {
            const p1 = new Point(Math.round(p.x / ZOOM), Math.round(p.y / ZOOM));
            this.stroke.push(p1);
            this.refresh();
        }
    }
    private refresh(): void {
        if (!(this.stroke.length < 2)) {
            const t = this.stroke.length - 2, i = this.midpoint;
            this.midpoint = this.getMidpoint(this.stroke[t], this.stroke[t + 1]),
                this.shape ? (this.updateWidth(this.distance(this.stroke[t], this.stroke[t + 1])),
                    this.draw(i, this.midpoint, this.stroke[t])) : (this.shape = new createjs.Shape,
                        this.container.addChild(this.shape),
                        this.draw(this.stroke[t], this.midpoint))
        }
    }

    private updateWidth(t: number): void {
        if (!(0 >= t)) {
            let o = Math.log(t) + LINE;
            o /= o > 0 ? VAR_MIN : VAR_MAX,
                this.width = Math.max(Math.min(this.width - o, LINE), MIN)
        }
    }

    private getMidpoint(p1: Point, p2: Point): Point {
        return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
