import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BallComponent } from './ball.component';
import { IBallState, ballReducer, initState } from './ball.reducer';
import { PanelRightModule } from '../panel-right.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import * as ballActions from './ball.actions';
import { Ball } from './ball.model';

describe('BallComponent', () => {
  let component: BallComponent;
  let fixture: ComponentFixture<BallComponent>;
  // let store: Store<IBallState>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PanelRightModule, RouterTestingModule,
        // StoreModule.forRoot({ballReducer})
      ],
      declarations: [ BallComponent ],
      providers: []
    }).compileComponents();

    // store = TestBed.get(Store);
    // spyOn(store, 'dispatch').and.callThrough();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have init state of 41 balls  10 dots', () => { console.log(initState);
    expect(initState.balls.length).toBe(41);
    expect(initState.dots.length).toBe(10);
    expect(initState.numberShow).toBe(false);
  });

  // it('should dispatch an action to add a ball', () => {
  //   const action = new ballActions.Add(new Ball('#fff'));
  //   expect(store.dispatch).toHaveBeenCalledWith(action);
  // });
});
