import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Shape, Circle, RoundedRect } from './shape.model';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss']
})
export class AutomationComponent implements OnInit {
  @ViewChild('canvas') canvasRef: ElementRef;
  private ctx: CanvasRenderingContext2D;
  width = 570;
  height = 540;
  color = 'rgb(215, 215, 215)';
  constructor() { }

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.layout();
  }

  private layout(): void {
    // this.ctx.fillStyle ='rgb(255, 255, 255)';
    // this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle =this.color;
    this.ctx.fillRect(this.width / 2 - 1, 0, 2, this.height);
    this.ctx.fillRect(0, this.height / 2 - 1, this.width, 2);

    this.ctx.font = '16px arial';
    this.ctx.fillText('Ratio 1px : 1mm', this.width - 150 , 30);

    Shape.setcontext(this.ctx);

    const circle = new Circle (this.width / 2, this.height / 2, 250);
    circle.setColor(this.color)
          .draw();

    const roundRect1 = new RoundedRect(135, (this.height - 50) / 2, 30, 50, 12);
    roundRect1.draw();

    const roundRect2 = new RoundedRect(this.width - 135 - 30, (this.height - 50) / 2, 30, 50, 12);
    roundRect2.draw();
  }
}