import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HanziComponent } from './hanzi.component';

describe('HanziComponent', () => {
    let component: HanziComponent;
    let fixture: ComponentFixture<HanziComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HanziComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HanziComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
