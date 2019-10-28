import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Shape, Circle, RoundedRect, Arc, WIDTH, HEIGHT } from './shape.model';

const roundWidth = 30, initX = 130;

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss']
})
export class AutomationComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvasRef: ElementRef;
  private ctx: CanvasRenderingContext2D;
  private color = 'rgb(215, 215, 215)';
  private roundRect1: RoundedRect;
  private roundRect2: RoundedRect;
  private arc1: Arc;
  private arc2: Arc;
  private circle: Circle;
  private speed = 10;
  private speedAng = Math.PI / 50;

  constructor() { }

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.layout();
    this.setElements();
    this.animate();
  }

  private clear(): void {
    this.ctx.fillStyle = 'rgb(255, 255, 255)';
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  private layout(): void {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(WIDTH / 2 - 1, 0, 2, HEIGHT);
    this.ctx.fillRect(0, HEIGHT / 2 - 1, WIDTH, 2);

    this.ctx.font = '16px arial';
    this.ctx.fillText('Ratio 1px : 1mm', WIDTH - 150 , 30);
  }

  private setElements(): void {
    Shape.setcontext(this.ctx);

    this.circle = new Circle(WIDTH / 2, HEIGHT / 2, 250);
    this.circle.setColor(this.color).draw();

    this.arc1 = new Arc(WIDTH / 2, HEIGHT / 2, 190, Math.PI / 2 + Math.PI / 4, this.speedAng);
    this.arc1.setColor('rgba(255, 0, 0, .1)').draw();

    this.arc2 = new Arc(WIDTH / 2, HEIGHT / 2, 190, Math.PI * 7 / 4, this.speedAng);
    this.arc2.setColor('rgba(255, 0, 0, .1)').draw();

    // initY: HEIGHT / 2 + 125 - 30 = 365, ; arc radius 176.78

    this.roundRect1 = new RoundedRect(initX, /*(HEIGHT - roundWidth) / 2*/ 365, roundWidth, roundWidth, 10);
    this.roundRect1.setColor(this.color).draw();
    // this.line = new Line(initX + roundWidth, 395 + roundWidth, WIDTH / 2, HEIGHT / 2);
    // this.line.setColor(this.color).draw();

    this.roundRect2 = new RoundedRect(WIDTH - initX - roundWidth, /*(HEIGHT - roundWidth) / 2*/145, roundWidth, roundWidth, 10);
    this.roundRect2.setColor(this.color).draw();
  }

  private animate(): void {
    if (this.speed > 0 && this.roundRect1.y <= 115 /*&& this.roundRect2.y >= HEIGHT - 115 - roundWidth*/ ) {
      // console.log(this.roundRect1.y, this.roundRect2.y)
      return;
    }
    this.clear();
    this.layout();
    this.roundRect1.setSpeed(this.speedAng).move();
    this.roundRect2.setSpeed(this.speedAng).move();
    this.arc1.move();
    this.arc2.move();
    setTimeout(() => {
      this.animate();
    }, 200);
  }
}
