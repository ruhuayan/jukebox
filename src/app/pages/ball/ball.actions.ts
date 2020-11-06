import { Action } from '@ngrx/store';
import { Ball, Margin, Square } from './ball.model';

export enum ActionTypes {
    Load = '[Ball Component] Load State',
    LoadSucces = '[Ball Component] Load State Success',
    Save = '[Ball Component] Save State',
    SaveSuccess = '[Ball Component] Save State Success',
    Move = '[Ball Component] Move',
    Add = '[Ball Component] Add',
    Update = '[Ball Component] Update',
    Remove = '[Ball Component] Remove',
    Reset = '[Ball Component] Reset',
    Angle = '[Ball Component] Change_Angle',
    ToggleNumber = '[Ball Component] Toggle_Number',
    UpdateConleft = '[Ball Component] Update_Conleft'
}

export class Load implements Action {
    readonly type = ActionTypes.Load;
}
export class Move implements Action {
    readonly type = ActionTypes.Move;
    constructor(public payload: Margin) { }
}
export class Update implements Action {
    readonly type = ActionTypes.Update;
    constructor(public payload: Ball[]) { }
}
export class Add implements Action {
    readonly type = ActionTypes.Add;
    constructor(public payload: Ball) { }
}
export class Remove implements Action {
    readonly type = ActionTypes.Remove;
    constructor(public payload: Ball) { }
}
export class Reset implements Action {
    readonly type = ActionTypes.Reset;
    constructor() { }
}
export class Angle implements Action {
    readonly type = ActionTypes.Angle;
    constructor(public payload: number) { }
}

export class ToggleNumber implements Action {
    readonly type = ActionTypes.ToggleNumber;
}

export class UpdateConleft implements Action {
    readonly type = ActionTypes.UpdateConleft;
    constructor(public payload: Square) { }
}

export type ActionUnion = Get | Move | Add | Remove | Reset | Update | Angle | ToggleNumber | UpdateConleft;
