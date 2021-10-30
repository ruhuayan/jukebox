import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BallComponent } from './ball.component';
import { IBallState, ballReducer, initState } from './state/ball.reducer';
import { PanelRightModule } from '../panel-right.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { ActionTypes, Reset } from './state/ball.actions';
import { Ball, RA, Status } from './ball.model';

describe('BallComponent', () => {
    let component: BallComponent;
    let fixture: ComponentFixture<BallComponent>;
    let store: MockStore<IBallState>;
    const initialState: IBallState = {
        balls: [...Array.from(new Array(40).keys()).map(i => new Ball(Status.CONSTRUCT)), new Ball(Status.TOLAUNCH)],
        dots: [],
        numberShow: false,
        angle: RA,
    };

    beforeEach(waitForAsync(() => {

        TestBed.configureTestingModule({
            imports: [PanelRightModule, RouterTestingModule],
            declarations: [BallComponent],
            providers: [provideMockStore({ initialState })]
        }).compileComponents();

    }));

    beforeEach(() => {
        const action = { type: 'NOOP' } as any;
        const result = ballReducer(undefined, action);
        store = (TestBed.inject(Store) as unknown) as MockStore<IBallState>;
        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(BallComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should have init state of 41 balls  10 dots', () => {
    //     expect(initialState.balls.length).toBe(41);
    //     expect(initState.dots.length).toBe(10);
    //     expect(initState.numberShow).toBe(false);
    // });

    // it('should dispatch an action to add a ball', () => {
    //   const action = new ballActions.Add(new Ball('#fff'));
    //   expect(store.dispatch).toHaveBeenCalledWith(action);
    // });
});
