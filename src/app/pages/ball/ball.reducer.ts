import { ActionTypes, ActionUnion } from './ball.actions';
import { Ball } from './ball.model';
import { ActionReducer, Action } from '@ngrx/store';

export interface IBallState {
    balls: Ball[];
}

export const initState: IBallState = {
    balls: Array.from(new Array(40).keys()).map(i => new Ball())
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
                balls: state.balls.map(ball =>
                  ball.id === action.payload.id ? action.payload : ball
                )
            };
            saveState(newState);
            return newState;

        case ActionTypes.Update:
            console.log(action.payload);
            return {...action.payload};

        case ActionTypes.Add:
            return saveState({
                balls: [...state.balls, action.payload]
            });

        case ActionTypes.Remove:
            action.payload.show = false;
            newState =  {
                // balls: state.balls.filter(ball => ball.id !== action.payload.id)
                balls: state.balls.map(ball =>
                  ball.id === action.payload.id ? action.payload : ball
                )
            };
            return saveState(newState);

        case ActionTypes.Reset:
            return saveState({ balls: []});
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
