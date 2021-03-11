import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IndexedDbService } from '../lib/indexedDb.service';
import * as hanziActions from './hanzi.actions'

@Injectable()
export class HanziEffect {
    constructor(private actions$: Actions, private indexedDbService: IndexedDbService) { }

    // @Effect()
    // loadDb$: Observable<Action> = this.actions$.pipe(
    //     ofType<hanziActions.LoadDb>(hanziActions.ActionTypes.LoadDb),
    //     switchMap(_ => this.indexedDbService.loadDb),
    //     map((infos: Info[]) => new jukeboxActions.LoadInfosSuccess(infos)),
    //     catchError(err => of(new jukeboxActions.LoadInfosFail(err)))
    // );
}