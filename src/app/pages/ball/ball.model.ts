import uuid from 'uuid';
export const COLORS = ['#663399', '#FF00FF', '#FFA500', '#6B8E23' ]; // ['#009900', '#663399', '#6b8e23', '#ff00ff'];
export class Ball {
    static count = 0;
    id: uuid;
    x: number;
    y: number;
    colorId: number;
    color: string;
    show = true;

    constructor() {
        this.id = uuid.v4();
        this.colorId = Math.floor(Math.random() * COLORS.length);
        this.color = COLORS[this.colorId];
        Ball.count ++;
    }
    static reset() {
      Ball.count = 0;
    }
}

export class Dot {
  x: number;
  y: number;
  constructor(x: number = null, y: number) {
    this.x = x;
    this.y = y;
  }
}

export enum KEY {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40
}
