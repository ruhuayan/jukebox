import { ActionTypes, ActionUnion } from './ball.actions';
import { Ball } from './ball.model';
 
export interface IBallState{
    balls: Ball[];
}
export const initState: IBallState = {
    balls: []
}
 
export function ballReducer(state:IBallState = initState, action: ActionUnion) {
  switch (action.type) {
    case ActionTypes.Move:
        return {
            balls: state.balls.forEach(ball => {
                if (ball.id === action.payload.id) {
                    ball = action.payload;
                }
            })
        };
    case ActionTypes.Add:
        return {
            balls: [...state.balls, action.payload]
        };
 
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