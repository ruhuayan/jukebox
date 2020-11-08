import { ActionTypes, ActionUnion } from './ball.actions';
import { Ball, Dot, Status, Container, COL, RA } from './ball.model';

export interface IBallState {
    balls: Ball[];
    dots: Dot[];
    numberShow: boolean;
    angle: number;
}

export const initState: IBallState = { balls: [], dots: [], numberShow: false, angle: RA };

export function ballReducer(state: IBallState = initState, action: ActionUnion) {
    switch (action.type) {
        case ActionTypes.Move:
            return {
                ...state,
                balls: state.balls.map(ball => {
                    if (ball.status === Status.TOLAUNCH) {
                        const margin = ball.margin || { left: 0, top: Container.height };
                        ball.margin = { left: margin.left - action.payload.left, top: margin.top - action.payload.top };
                        ball.marginTop = `calc(${ball.margin.top}px - 100% / 16)`;
                        ball.marginLeft = margin.left - action.payload.left;
                    }
                    return ball;
                })
            };

        case ActionTypes.Update:
            return { ...action.payload };

        case ActionTypes.Add:
            return {
                ...state,
                balls: [...state.balls, action.payload]
            };

        case ActionTypes.Remove:
            action.payload.show = false;
            return {
                ...state,
                balls: state.balls.filter((ball: Ball) => ball.index !== action.payload.index)
                // balls: state.balls.map(ball =>
                //     ball.index === action.payload.index ? action.payload : ball
                // )
            };

        case ActionTypes.Reset:
            return { ...createInitState() };

        case ActionTypes.Angle:
            return {
                ...state,
                angle: action.payload,
                dots: state.dots.map((_, i) =>
                    new Dot(Math.sin(RA - action.payload) * (-12 * i), Container.height - 12 + Math.cos(RA - action.payload) * (-12 * i)))
            };

        case ActionTypes.ToggleNumber:
            return {
                ...state,
                numberShow: !state.numberShow
            };
        case ActionTypes.UpdateContainer:
            return {
                ...state,
                balls: state.balls.map((ball: Ball) => {
                    if (ball.index < 40) {
                        ball.setDist(action.payload.width, action.payload.height);
                    }
                    return ball;
                }),
                dots: Array.from(new Array(10).keys()).map(i => new Dot(0, action.payload.height - 12 * (i + 1))),
            };
        default:
            return state;
    }
}

function createBalls(): Ball[] {
    const balls = Array.from(new Array(40).keys()).map(i => new Ball(Status.CONSTRUCT));
    balls.forEach((ball: Ball, i: number) => {
        // To find adjacent same colored balls
        if (i % COL > 0) {
            if (i % COL < COL) ball.linkBall(balls[i - 1]);
            if (balls[i - 1].colorId === ball.colorId) {
                ball.unionBall(balls[i - 1], balls);
            }
        }
        if (Math.floor(i / COL) > 0) {
            ball.linkBall(balls[i - COL]);
            if (balls[i - COL].colorId === ball.colorId) {
                ball.unionBall(balls[i - COL], balls);
            }
        }

        ball.setDist(Container.width);
    });
    return [...balls, new Ball(Status.TOLAUNCH)];
}

export function createInitState(): IBallState {
    return {
        balls: createBalls(),
        dots: Array.from(new Array(10).keys()).map(i => new Dot(0, Container.height - 12 * (i + 1))),
        numberShow: false,
        angle: RA
    }
}

