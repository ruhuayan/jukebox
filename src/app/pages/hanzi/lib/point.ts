export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static from(a: number[]): Point {
        return new Point(a[0], a[1]);
    }

    static toArray(p: Point): number[] {
        return [p.x, p.y];
    }
}