export const WIDTH = 570, HEIGHT = 540;

export interface Drawable {
  setColor(color: string): Drawable;
  draw(): void;
}
export interface Movable {
  setSpeed(speed: number): Movable;
  move(x: number, y: number): void;
}

export class Shape implements Drawable, Movable {
  x: number;
  y: number;
  speed: number;
  color: string;
  static ctx: CanvasRenderingContext2D;

  constructor (x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static setcontext(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
  }

  public setColor(color: string): Shape {
    this.color = color;
    return this;
  }
  public draw(): void {}

  public setSpeed(speed: number): Shape {
    this.speed = speed;
    return this;
  }
  public move(): void {
    if (! this.speed) {
      throw new Error('Can not move with speed');
    }
  }

}

export class Line extends Shape {
  private endX: number;
  private endY: number;
  ctx: CanvasRenderingContext2D;
  constructor(startX: number, startY: number, endX: number, endY: number) {
    super(startX, startY);
    this.endX = endX;
    this.endY = endY;
    this.ctx = Shape.ctx;
  }
  public draw() {
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = this.color;
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.endX, this.endY);
    this.ctx.stroke();
  }
  public move(): void {
    this.draw();
  }
}

export class Arc extends Shape {
  private radius: number;
  private ctx: CanvasRenderingContext2D;
  private startAngle: number;
  // private speed: number;
  constructor(x: number, y: number, radius: number, startAng: number, speed: number) {
    super(x, y);
    this.radius = radius;
    this.ctx = Shape.ctx;
    this.startAngle = startAng;
    // this.endAngle = startAng + speed;
    this.speed = speed;
  }

  public draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.arc(this.x, this.y, this.radius, this.startAngle, this.startAngle);
    this.ctx.lineTo(this.x, this.y);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
  }

  public move() {
    this.startAngle += this.speed;
    // this.endAngle += this.ang;
    this.draw();
  }
}

export class Circle extends Shape {
  radius: number;
  ctx: CanvasRenderingContext2D;

  constructor(x: number, y: number, radius: number) {
    super(x, y);
    this.radius = radius;
    this.ctx = Shape.ctx;
  }

  public draw(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
  }

  public move(): void {
    // // c**2 = a**2 + b**2 - 2 a b cos∠c
    // this.ang += Math.PI / 20;
    // const speed = Math.sqrt(2 * this.radius ** 2 * (1 - Math.cos(this.ang))); console.log(this.ang, speed);
    // this.speedX = speed * Math.sin(this.ang);
    // this.speedY = speed * Math.cos(this.ang);
    // this.line.x = this.line.x + this.speedX;
    // this.line.y = this.line.y - this.speedY;
    // this.line.draw();
  }

}
export class RoundedRect extends Shape {

  radius: number;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  constructor (x: number, y: number, w: number, h: number, radius: number) {
    super(x, y);
    this.radius = radius;
    this.width = w;
    this.height = h;
    this.ctx = Shape.ctx;
  }

  public draw() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.color;
    this.ctx.moveTo(this.x, this.y + this.radius);
    this.ctx.lineTo(this.x, this.y + this.height - this.radius);
    this.ctx.arcTo(this.x, this.y + this.height, this.x + this.radius, this.y + this.height, this.radius);
    this.ctx.lineTo(this.x + this.width - this.radius, this.y + this.height);
    this.ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width, this.y + this.height - this.radius, this.radius);
    this.ctx.lineTo(this.x + this.width, this.y + this.radius);
    this.ctx.arcTo(this.x + this.width, this.y, this.x + this.width - this.radius, this.y, this.radius);
    this.ctx.lineTo(this.x + this.radius, this.y);
    this.ctx.arcTo(this.x, this.y, this.x, this.y + this.radius, this.radius);
    this.ctx.stroke();
  }

  public move(): void {
    const sideX = WIDTH / 2 - this.x - this.width;
    const sideY = this.y - HEIGHT / 2 + this.width;
    const hypotenuse = Math.hypot(sideX, sideY); 
    const angX = Math.asin(sideX / hypotenuse);
    const angY = Math.PI - this.speed - angX; console.log(this.x, this.y - HEIGHT / 2, hypotenuse, angX, angY, this.speed)
    this.y -= Math.sin(this.speed) / Math.sin(angY) * hypotenuse;
    this.draw();
  }
}
