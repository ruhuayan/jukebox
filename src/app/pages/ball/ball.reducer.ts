import { ActionTypes, ActionUnion } from './ball.actions';
import { Ball } from './ball.model';
import { ActionReducer, Action } from '@ngrx/store';

export interface IBallState{
    balls: Ball[];
}
export const initState: IBallState = {
    balls: []
};

const saveState = (_state: IBallState) => {
  localStorage.setItem('__balls', JSON.stringify(_state));
  return _state;
}
export function ballReducer(state: IBallState = initState, action: ActionUnion) {
    let newState: IBallState;
    switch (action.type) {
        case ActionTypes.Move:
            newState = { balls: []
                // balls: state.balls.forEach(ball => {
                //     if (ball.id === action.payload.id) {
                //         ball = action.payload;
                //     }
                // })
            };
            return newState;

        case ActionTypes.Update:
            console.log(action.payload);
            return {...action.payload};

        case ActionTypes.Add:

            return saveState({
                balls: [...state.balls, action.payload]
            });

        case ActionTypes.Remove:
            newState =  {
                balls: state.balls.filter(ball => ball.id !== action.payload.id)
            };
            saveState(newState);
            return newState;

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
