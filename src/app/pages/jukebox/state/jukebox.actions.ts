import { Action } from '@ngrx/store';
import { Info } from '../model/info.interface';
import { Metadata } from '../model/metadata.interface';

export enum ActionTypes {
    LoadMusic = '[Jukebox Component] Load Music',
    LoadMusicSuccess = '[Jukebox Component] Load Music Success',
    LoadMusicFail = '[Jukebox Component] Load Music Fail',
    Decode = '[Jukebox Component] Decode',
    DecodeSuccess = '[Jukebox Component] Decode Success',
    DecodeFail = '[Jukebox Component] Decode Fail',
    LoadMeta = '[Jukebox Component] Load Meta',
    LoadMetaSuccess = '[Jukebox Component] Load Meta Success',
    LoadMetaFail = '[Jukebox Component] Load Meta Fail',
    LoadInfos = '[Jukebox Component] Load Infos',
    LoadInfosSuccess = '[Jukebox Component] Load Infos Success',
    LoadInfosFail = '[Jukebox Component] Load Infos Fail',
    MusicPlay = '[Jukebox Component] Music Play',
    Pause = '[Jukebox Component] Music Pause',
    Next = '[Jukebox Component] Next',
    Prev = '[Jukebox Component] Prev',
    Reset = '[Jukebox Component] Reset',
    TogglePlay = '[Jukebox Component] Toggle Play',
}

export class LoadMusic implements Action {
    readonly type = ActionTypes.LoadMusic;
    constructor(public payload: string) { }
}

export class LoadMusicSuccess implements Action {
    readonly type = ActionTypes.LoadMusicSuccess;
    constructor(public payload: ArrayBuffer) { }
}

export class LoadMusicFail implements Action {
    readonly type = ActionTypes.LoadMusicFail;
    constructor(public payload: string) { }
}

export class Decode implements Action {
    readonly type = ActionTypes.Decode;
    constructor(public payload: ArrayBuffer) { }
}

export class DecodeSuccess implements Action {
    readonly type = ActionTypes.DecodeSuccess;
    constructor(public payload: AudioBuffer) { }
}

export class DecodeFail implements Action {
    readonly type = ActionTypes.DecodeFail;
    constructor(public payload: string) { }
}

export class LoadMeta implements Action {
    readonly type = ActionTypes.LoadMeta;
    constructor(public payload: ArrayBuffer) { }
}

export class LoadMetaSuccess implements Action {
    readonly type = ActionTypes.LoadMetaSuccess;
    constructor(public payload: Metadata) { }
}

export class LoadMetaFail implements Action {
    readonly type = ActionTypes.LoadMetaFail;
    constructor(public payload: string) { }
}

export class LoadInfos implements Action {
    readonly type = ActionTypes.LoadInfos;
}

export class LoadInfosSuccess implements Action {
    readonly type = ActionTypes.LoadInfosSuccess;
    constructor(public payload: Info[]) { }
}

export class LoadInfosFail implements Action {
    readonly type = ActionTypes.LoadInfosFail;
    constructor(public payload: string) { }
}

export class MusicPlay implements Action {
    readonly type = ActionTypes.MusicPlay;
    constructor(public payload: Boolean) { }
}

export class Reset implements Action {
    readonly type = ActionTypes.Reset;
    constructor() { }
}

export class Next implements Action {
    readonly type = ActionTypes.Next;
}

export class Prev implements Action {
    readonly type = ActionTypes.Prev;
}

export class TogglePlay implements Action {
    readonly type = ActionTypes.TogglePlay;
}

export type ActionUnion = LoadMusic | LoadMusicSuccess | LoadMusicFail | LoadMeta | LoadMetaSuccess | LoadMetaFail |
    Decode | LoadInfos | LoadInfosSuccess | LoadInfosFail | MusicPlay | Next | Prev | Reset | TogglePlay;
