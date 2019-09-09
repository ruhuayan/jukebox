export const COLORS = ['#663399', '#FF00FF', '#FFA500', '#6B8E23' ];

export const RA = Math.PI / 2;
export const ANG = Math.PI / 120;
export const HEIGHT = 540;
export const WIDTH = 570;
export const COL = 8;

export interface Margin {
  left: number;
  top: number;
}
export class Ball {
    static count = 0;

    index: number;
    margin: Margin;
    colorId: number;
    color: string;
    show = true;
    status: string;
    marginTop: string;
    marginLeft = 0;
    // connected ball with same color
    union: number[];
    // adjacent balls, adjacent to wall -> [-1]
    link: number[];
    // Angle to the first dot
    angle: number;
    // Distance to the first dot
    dist: number;
    // Distance of the launching ball to dot when collide with ball
    launchDist: number;

    constructor(status = null) {

        this.colorId = Math.floor(Math.random() * COLORS.length);
        this.color = COLORS[this.colorId];
        this.status = status;
        this.index = Ball.count;
        this.union = [this.index];
        this.link = this.initLink();
        this.dist = 0;
        Ball.count ++;
    }
    static reset() {
      Ball.count = 0;
    }

    public unionBall(b1: Ball, balls: Ball[]): number[] {
      const set = new Set([...b1.union, ...this.union]);
      const arr = Array.from(set);
      arr.forEach(n => balls[n].union = arr);
      return arr;
    }

    public linkBall(b1: Ball): void {
      this.link.push(b1.index);
      b1.link = [...b1.link, this.index];
    }

    public setDist(cw: number): void {
      const bw = cw / COL;
      const opposite = HEIGHT - bw / 2 - bw * Math.floor(this.index / COL);
      let adjacent: number;
      if (this.index % COL < COL / 2) {
        adjacent = cw / 2 - bw / 2 - bw * (this.index % COL);
        this.angle = Math.atan(opposite / adjacent);
      } else {
        adjacent = bw * (this.index % COL) + bw / 2 - cw / 2;
        this.angle = Math.PI - Math.atan(opposite / adjacent);
      }
      this.dist = Math.hypot(opposite, adjacent);
    }

    private initLink(): number[] {
      return this.index < 40 && this.isLinkedToWall ? [-1] : [];
    }

    private isLinkedToWall(): boolean {
      return Math.floor(this.index / COL) === 0 || this.index % COL === 0 || this.index % COL === COL - 1;
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
