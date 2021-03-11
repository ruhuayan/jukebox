import { Action } from '@ngrx/store';
import { Record } from '../lib';

export enum ActionTypes {
    LoadDb = '[Hanzi Component] Load Hanzi Db',
    LoadDbSuccess = '[Hanzi Component] Load Hanzi Db Success',
    Search = '[Hanzi Component] Search Hanzi',
}

export class LoadDb implements Action {
    readonly type = ActionTypes.LoadDb;
}

export class LoadDbSuccess implements Action {
    readonly type = ActionTypes.LoadDbSuccess;
    constructor(public payload: Record) { }
}

export class Search implements Action {
    readonly type = ActionTypes.Search;
    constructor(public payload: string) { }
}

export type ActionUnion = LoadDb | LoadDbSuccess | Search;