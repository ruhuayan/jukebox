import { ActionTypes, ActionUnion } from './ball.actions';
import { Ball, Dot, RA, HEIGHT, ANG, Status } from './ball.model';
// import { ActionReducer, Action } from '@ngrx/store';

export interface IBallState {
    balls: Ball[];
    dots: Dot[];
    numberShow: boolean;
}

export const initState: IBallState = {
    balls: Array.from(new Array(41).keys()).map(i => i === 40 ? new Ball('toLaunch') : new Ball()),
    dots: Array.from(new Array(10).keys()).map(i => new Dot(0, HEIGHT - 12 * (i + 1))),
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
                    ball.margin = action.payload;
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
                  ball.id === action.payload.id ? action.payload : ball
                )
            };
            return saveState(newState);

        case ActionTypes.Reset:
            return saveState({...state, balls: []});

        case ActionTypes.Angle:
            return saveState({
              ...state,
              dots: state.dots.map((dot, i) =>
                new Dot(Math.sin(action.payload) * (-12 * i), HEIGHT - 12 + Math.cos(action.payload) * (-12 * i)))
            });

        case ActionTypes.ToggleNumber:
            return saveState({
              ...state,
              numberShow: !state.numberShow
            });
        default:
            return state;
    }
}

