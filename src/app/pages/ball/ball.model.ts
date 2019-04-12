export class Ball {
    id: number;
    xPos: number;
    yPos: number;
    color: string;

    constructor(color: string) {
        this.id = Math.random();
        this.color = color;
    }
}