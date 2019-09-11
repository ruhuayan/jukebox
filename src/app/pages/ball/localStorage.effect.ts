import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { fromEvent, EMPTY } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';
import {
  ActionUnion, ActionTypes
} from './ball.actions';

@Injectable()
export class LocalStorageEffects {
//   // change this to `dispatch: true` to sync state with actions
//   @Effect({ dispatch: false })
//   onChange = fromEvent<StorageEvent>(window, 'storage').pipe(
//     filter(evt => evt.key === '__bus'),
//     filter(evt => evt.newValue !== null),
//     map(evt => { //console.log(evt.newValue);
//       const [{ type, payload }] = JSON.parse(evt.newValue);
//       switch (type) {
//         case ActionTypes.Add:
//           return { type: ActionTypes.Add, payload };
//         case ActionTypes.Move:
//           return { type: ActionTypes.Move, payload };
//         case ActionTypes.Remove:
//           return { type: ActionTypes.Remove, payload };
//         default:
//           return EMPTY;
//       }
//     }),
//   );

//   @Effect({ dispatch: false })
//   storeActions = this.actions.pipe(
//     ofType(
//       ActionTypes.Add,
//       ActionTypes.Remove,
//       ActionTypes.Move
//     ),
//     tap(action => {
//       const storedActions = window.localStorage.getItem('__bus');
//       const actions = storedActions ? JSON.parse(storedActions) : [];
//       const newActions = [action, ...actions];
//       window.localStorage.setItem('__bus', JSON.stringify(newActions));
//     }),
//   );

  // change this to `dispatch: true` to sync state with state
  @Effect({ dispatch: true })
  updateState = fromEvent<StorageEvent>(window, 'storage').pipe(
    filter(evt => evt.key === '__balls'),
    filter(evt => evt.newValue !== null),
    map(evt => {
      const newState = JSON.parse(evt.newValue);
      return { type: ActionTypes.Update, payload: { ...newState } };
    }),
  );

  constructor(private actions: Actions<ActionUnion>) {}
}
