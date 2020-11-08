import { Action } from '@ngrx/store';

export enum ActionTypes {
    Load = '[Hanzi Component] Load Hanzi',
    Search = '[Hanzi Component] Search Hanzi',
}

export class Load implements Action {
    readonly type = ActionTypes.Load;
}
export class Search implements Action {
    readonly type = ActionTypes.Search;
    constructor(public payload: string) { }
}

export type ActionUnion = Load | Search;