import { ActionTypes, ActionUnion } from './ball.actions';
import { Ball } from './ball.model';
import { ActionReducer, Action } from '@ngrx/store';

export interface IBallState{
    balls: Ball[];
}
export const initState: IBallState = {
    balls: []
};

const returnState = (_state: IBallState) => {
  localStorage.setItem('__balls', JSON.stringify(_state));
  return _state;
}
export function ballReducer(state: IBallState = initState, action: ActionUnion) {
  switch (action.type) {
    case ActionTypes.Move:
        return {
            balls: state.balls.forEach(ball => {
                if (ball.id === action.payload.id) {
                    ball = action.payload;
                }
            })
        };

    case ActionTypes.Update:
        console.log(action.payload);
        return {...action.payload};

    case ActionTypes.Add:

        const newState =  {
            balls: [...state.balls, action.payload]
        };
        window.localStorage.setItem('__balls', JSON.stringify(newState));
        return newState;

    case ActionTypes.Remove:
        return {
            balls: state.balls.filter(ball => ball.id !== action.payload.id)
        };

    case ActionTypes.Reset:
        return {
            balls: []
        };

    default:
        return state;
  }
}

export function persistStateReducer(_reducer: ActionReducer<IBallState>) {
  const localStorageKey = '__balls';
  return (state: IBallState | undefined, action: Action) => {
    if (state === undefined) {
      const persisted = localStorage.getItem(localStorageKey);
      return persisted ? JSON.parse(persisted) : _reducer(state, action);
    }

    const nextState = _reducer(state, action);
    localStorage.setItem(localStorageKey, JSON.stringify(nextState));
    return nextState;
  };
}
