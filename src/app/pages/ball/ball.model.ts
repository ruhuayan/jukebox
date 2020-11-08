export const COLORS = ['#663399', '#FF00FF', '#FFA500', '#6B8E23'];

export const RA = Math.PI / 2;
export const ANG = Math.PI / 120;
export const COL = 8;
export interface Square {
    width: number;
    height: number;
}

export const Container: Square = {
    width: 570,
    height: 540
}

export interface Margin {
    left: number;
    top: number;
}
export class Ball {
    static count = 0;
    static width = Math.round(Container.width / COL);

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

    constructor(status) {

        this.colorId = Math.floor(Math.random() * COLORS.length);
        this.color = COLORS[this.colorId];
        this.status = status;
        this.dist = 0;
        if (status !== Status.COPY) {

            this.index = Ball.count;
            this.union = [this.index];
            this.link = this.initLink();
            Ball.count++;
        }
    }

    static create(props): Ball {
        const ball = new Ball(Status.COPY);
        Object.assign(ball, props);
        Ball.count = Math.max(Ball.count, props['index']);
        Ball.count++;
        return ball;
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
        b1.link.push(this.index);
    }

    public setDist(cw: number, height: number = Container.height): void {
        const bw = Ball.width;
        const opposite = height - bw / 2 - bw * Math.floor(this.index / COL);
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
        return this.index < 40 && this.isLinkedToWall() ? [-1] : [];
    }

    private isLinkedToWall(): boolean {
        return this.index < COL || this.index % COL === 0 || this.index % COL === COL - 1;
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
    CONSTRUCT = 'construct',
    COPY = 'copy',
    TOLAUNCH = 'toLaunch',
    STOPPED = 'stopped'
}
