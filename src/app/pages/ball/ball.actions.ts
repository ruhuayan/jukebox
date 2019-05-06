import { Action } from '@ngrx/store';
import { Ball } from './ball.model';

export enum ActionTypes {
    Move    = '[Ball Component] Move',
    Add     = '[Ball Component] Add',
    Update  = '[Ball Component] Update',
    Remove  = '[Ball Component] Remove',
    Reset   = '[Ball Component] Reset',
    Angle   = '[Ball Component] Change_Angle',
    ToggleNumber = '[Ball Component] Toggle_Number'
}

export class Move implements Action {
    readonly type = ActionTypes.Move;
    constructor(public payload: Ball) {}
}
export class Update implements Action {
  readonly type = ActionTypes.Update;
  constructor(public payload: Ball[]) {}
}
export class Add implements Action {
    readonly type = ActionTypes.Add;
    constructor(public payload: Ball) {}
}
export class Remove implements Action {
    readonly type = ActionTypes.Remove;
    constructor(public payload: Ball) {}
}
export class Reset implements Action {
    readonly type = ActionTypes.Reset;
    constructor() {}
}
export class Angle implements Action {
    readonly type = ActionTypes.Angle;
    constructor(public payload: number) {}
}

export class ToggleNumber implements Action {
    readonly type = ActionTypes.ToggleNumber;
}

export type ActionUnion = Move | Add | Remove | Reset | Update | Angle | ToggleNumber;
