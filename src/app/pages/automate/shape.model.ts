export interface Drawable {
	setColor(color: string): Drawable;
	draw(): void;
}

export class Shape implements Drawable {
	x: number;
	y: number;
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
		this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2);
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
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
		this.ctx.moveTo(this.x, this.y + this.radius);
		this.ctx.lineTo(this.x, this.y + this.height - this.radius);
		this.ctx.arcTo(this.x, this.y + this.height, this.x + this.radius, this.y + this.height, this.radius);
		this.ctx.lineTo(this.x + this.width - this.radius, this.y + this.height);
		this.ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width, this.y + this.height-this.radius, this.radius);
		this.ctx.lineTo(this.x + this.width, this.y + this.radius);
		this.ctx.arcTo(this.x + this.width, this.y, this.x + this.width - this.radius, this.y, this.radius);
		this.ctx.lineTo(this.x + this.radius, this.y);
		this.ctx.arcTo(this.x, this.y, this.x, this.y + this.radius, this.radius);
		this.ctx.stroke();
	}
}