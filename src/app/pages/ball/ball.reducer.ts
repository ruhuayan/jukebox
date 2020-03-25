import { ActionTypes, ActionUnion } from './ball.actions';
import { Ball, Dot, RA, conleft, COL, Square } from './ball.model';

export interface IBallState {
    balls: Ball[];
    dots: Dot[];
    numberShow: boolean;
}

function createBalls(): Ball[] {
    const balls = Array.from(new Array(40).keys()).map(i => new Ball());
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
        ball.setDist(conleft.width);
    });
    return [...balls, new Ball('toLaunch')];
}

export const initState: IBallState = {
    balls: createBalls(),
    dots: Array.from(new Array(10).keys()).map(i => new Dot(0, conleft.height - 12 * (i + 1))),
    numberShow: false
};

const saveState = (_state: IBallState) => {
    localStorage.setItem('__balls', JSON.stringify(_state));
    return _state;
};
saveState(initState);
export function ballReducer(state: IBallState = initState, action: ActionUnion) {
    let newState: IBallState;
    switch (action.type) {
        case ActionTypes.Move:
              newState =  {
                ...state,
                balls: state.balls.map(ball => {
                    if (ball.status === 'toLaunch') {
                        const margin = ball.margin || {left: 0, top: conleft.height};
                        ball.margin = {left: margin.left - action.payload.left, top: margin.top - action.payload.top };
                        ball.marginTop = `calc(${ball.margin.top}px - 100% / 16)`;
                        ball.marginLeft = margin.left - action.payload.left;
                    }
                    return ball;
                })
            };
            saveState(newState);
            return newState;

        case ActionTypes.Update:
            console.log(action.payload);
            return {...action.payload};

        case ActionTypes.Add:
            return saveState({
              ...state,
              balls: [...state.balls, action.payload]
            });

        case ActionTypes.Remove:
            action.payload.show = false;
            newState =  {
                ...state,
                    // balls: state.balls.filter(ball => ball.id !== action.payload.id)
                balls: state.balls.map(ball =>
                    ball.index === action.payload.index ? action.payload : ball
                    )
            };
            return saveState(newState);

        case ActionTypes.Reset:
            return saveState({...state, balls: createBalls()});

        case ActionTypes.Angle:
            return saveState({
                ...state,
                dots: state.dots.map((dot, i) =>
                    new Dot(Math.sin(action.payload) * (-12 * i), conleft.height - 12 + Math.cos(action.payload) * (-12 * i)))
            });

        case ActionTypes.ToggleNumber:
            return saveState({
                ...state,
                numberShow: !state.numberShow
            });
        case ActionTypes.UpdateConleft:
            return saveState({
                ...state,
                // balls: state.balls.map((ball: Ball) => {
                //     if (ball.index < 40) {
                //       ball.setDist(action.payload.width, action.payload.width);
                //     }
                //     return ball;
                // }),
                dots: Array.from(new Array(10).keys()).map(i => new Dot(0, action.payload.height - 12 * (i + 1))),
          })
        default:
            return state;
    }
}

