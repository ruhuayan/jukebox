import uuid from 'uuid';
export class Ball {
    id: number;
    xPos: number;
    yPos: number;
    color: string;

    constructor(color: string) {
        this.id = uuid.v4();
        this.color = color;
    }
}
