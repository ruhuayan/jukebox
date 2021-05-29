import { createSelector } from "@ngrx/store";
import { IBallState } from './ball.reducer';

export const selectBalls = createSelector(
    iState => iState['iBallState'],
    (state: IBallState) => state.balls
);

export const selectDots = createSelector(
    iState => iState['iBallState'],
    (state: IBallState) => state.dots
);

export const selectNumberShow = createSelector(
    iState => iState['iBallState'],
    (state: IBallState) => state.numberShow
);

export const selectAngle = createSelector(
    iState => iState['iBallState'],
    (state: IBallState) => state.angle
);