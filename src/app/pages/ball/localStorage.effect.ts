import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import * as ballActions from './ball.actions';
import { Ball, Dot, RA } from './ball.model';
import { IBallState } from './ball.reducer';

@Injectable()
export class LocalStorageEffects {

  @Effect({ dispatch: false })
  SaveState = this.actions.pipe(
    ofType(
      ballActions.ActionTypes.Add,
      ballActions.ActionTypes.Move,
      ballActions.ActionTypes.Update,
      ballActions.ActionTypes.Remove,
      ballActions.ActionTypes.Reset,
      ballActions.ActionTypes.Angle,
      ballActions.ActionTypes.ToggleNumber,
    ),
    withLatestFrom(this.store$.select('iBallState')),
    tap(([_, state]) => {
      window.localStorage.setItem('__IBallState', JSON.stringify(state));
    }),
  );

  @Effect({ dispatch: true })
  LoadState = this.actions.pipe(
    ofType(
      ballActions.ActionTypes.Load
    ),
    map(_ => {
      const storedState = window.localStorage.getItem('__IBallState');
      const state: IBallState = storedState ? JSON.parse(storedState) : {};
      if (state && state['balls'] && state['dots']) {
        const iState = {
          balls: state['balls'].map(b => Ball.create(b)),
          dots: state['dots'].map(d => new Dot(d.x, d.y)),
          numberShow: state['numberShow'] ?? false,
          angle: state['angle'] ?? RA
        };
        return { type: ballActions.ActionTypes.Update, payload: { ...iState } };
      } else {
        return { type: ballActions.ActionTypes.Reset };
      }
    })
  );

  // change this to `dispatch: true` to sync state with state 😊
  // @Effect({ dispatch: true })
  // updateState = fromEvent<StorageEvent>(window, 'storage').pipe(
  //   filter(evt => evt.key === '__IBallState'),
  //   filter(evt => evt.newValue !== null),
  //   map(evt => {
  //     const state = JSON.parse(evt.newValue);
  //     const iState = {
  //       balls: state['balls'].map(b => Ball.create(b)),
  //       dots: state['dots'].map(d => new Dot(d.x, d.y)),
  //       numberShow: state['numberShow'] ?? false,
  //       angle: state['angle'] ?? RA
  //     };
  //     return { type: ballActions.ActionTypes.Update, payload: { ...iState } };
  //   }),
  // );

  constructor(private actions: Actions<ballActions.ActionUnion>, private store$: Store<IBallState>) { }
}
