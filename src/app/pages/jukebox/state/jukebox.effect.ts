import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from '@ngrx/effects';
import { merge, Observable, of } from 'rxjs';
import { map, catchError, switchMap, tap, buffer } from 'rxjs/Operators'
import { Action } from "@ngrx/store";
import * as jukeboxActions from './jukebox.actions';
import { JukeService } from '../model/jukebox.service';
import { Info } from '../model/info.interface';
import { LoaderService } from '../model/loader.service';
import { Metadata } from '../model/metadata.interface';

@Injectable()
export class JukeboxEffect {

    constructor(private actions$: Actions, private jukeboxService: JukeService, private loaderService: LoaderService) { }

    @Effect()
    loadInfo$: Observable<Action> = this.actions$.pipe(
        ofType<jukeboxActions.LoadInfos>(jukeboxActions.ActionTypes.LoadInfos),
        switchMap(_ => this.jukeboxService.getMusicInfo()),
        map((infos: Info[]) => new jukeboxActions.LoadInfosSuccess(infos)),
        catchError(err => of(new jukeboxActions.LoadInfosFail(err)))
    );

    @Effect()
    loadMusic$: Observable<Action> = this.actions$.pipe(
        ofType<jukeboxActions.LoadMusic>(jukeboxActions.ActionTypes.LoadMusic),

        switchMap(action => this.loaderService.load(action.payload)),
        switchMap((buffer: ArrayBuffer) => this.loaderService.decodeAudioData(buffer)),
        switchMap(audioBuffer => this.loaderService.start(audioBuffer)),
        map((isPlaying) => new jukeboxActions.MusicPlay(isPlaying)),
        catchError(err => of(new jukeboxActions.LoadMusicFail(err)))
    );

    @Effect()
    togglePlay: Observable<Action> = this.actions$.pipe(
        ofType<jukeboxActions.TogglePlay>(jukeboxActions.ActionTypes.TogglePlay),
        switchMap(_ => this.loaderService.togglePlay()),
        map((isPlaying) => new jukeboxActions.MusicPlay(isPlaying)),
        catchError(err => of(new jukeboxActions.LoadInfosFail(err)))
    );

    @Effect()
    decode: Observable<Action> = this.actions$.pipe(
        ofType<jukeboxActions.Decode>(jukeboxActions.ActionTypes.Decode),
        switchMap(action => this.loaderService.decodeAudioData(action.payload)),
        switchMap(audioBuffer => this.loaderService.start(audioBuffer)),
        map((isPlaying) => new jukeboxActions.MusicPlay(isPlaying)),
        catchError(err => of(new jukeboxActions.LoadMusicFail(err)))
    );

    @Effect()
    loadMetadata: Observable<Action> = this.actions$.pipe(
        ofType<jukeboxActions.LoadMeta>(jukeboxActions.ActionTypes.LoadMeta),
        switchMap(action => this.loaderService.loadMetaData(action.payload)),
        map((metadata: Metadata) => new jukeboxActions.LoadMetaSuccess(metadata)),
        catchError(err => of(new jukeboxActions.LoadMusicFail(err)))
    );
}