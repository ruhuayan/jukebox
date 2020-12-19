import { Metadata } from '../model/metadata.interface';
import { Info } from '../model/info.interface';
import { ActionTypes, ActionUnion } from './jukebox.actions';

export interface IJukeboxState {
    infos: Info[];
    loading: boolean;
    loaded: boolean;
    error: string;
    isPlaying: boolean;
}

export const initState: IJukeboxState = { infos: [], loading: true, loaded: false, error: '', isPlaying: false }
export function jukeboxReducer(state: IJukeboxState = initState, action: ActionUnion) {
    switch (action.type) {
        case ActionTypes.LoadInfosSuccess:
            return {
                ...state,
                infos: action.payload
            };

        case ActionTypes.LoadInfosFail:
            return {
                ...state,
                error: action.payload
            };

        case ActionTypes.LoadMusicFail:
            return {
                ...state,
                error: action.payload
            }

        case ActionTypes.LoadMetaSuccess:
            return {
                ...state,
                metadata: action.payload
            }

        case ActionTypes.MusicPlay:
            return {
                ...state,
                loading: false,
                loaded: true,
                isPlaying: action.payload,
            }
        default:
            return state;
    }

}