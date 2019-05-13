// import uuid from 'uuid';
export const COLORS = ['#663399', '#FF00FF', '#FFA500', '#6B8E23' ];

export interface Margin {
  left: number;
  top: number;
}
export class Ball {
    static count = 0;
    // id: uuid;
    index: number;
    margin: Margin;
    colorId: number;
    color: string;
    show = true;
    status: string;
    marginTop: string;
    marginLeft = 0;
    union: number[];

    constructor(status = null) {
        // this.id = uuid.v4();
        this.colorId = Math.floor(Math.random() * COLORS.length);
        this.color = COLORS[this.colorId];
        this.status = status;
        this.index = Ball.count;
        this.union = [this.index];
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

export enum Status {
  SHOW = 'show',
  TOLAUNCH = 'toLaunch',
  STOPPED = 'stopped'
}

export const RA = Math.PI / 2;
export const ANG = Math.PI / 120;
export const HEIGHT = 540;
export const COL = 8;
