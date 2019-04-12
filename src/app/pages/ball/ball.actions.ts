import { Action } from '@ngrx/store';
import { Ball } from './ball.model';

export enum ActionTypes {
    Move    = '[Ball Component] Move',
    Add     = '[Ball Component] Add',
    Remove  = '[Ball Component] Remove',
    Reset   = '[Ball Component] Reset'
}

export class Move implements Action {
    readonly type = ActionTypes.Move;
    constructor(public payload: Ball) {}
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

export type ActionUnion = Move | Add | Remove | Reset;