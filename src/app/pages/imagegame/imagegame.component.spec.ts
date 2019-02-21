import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagegameComponent } from './imagegame.component';

describe('ImagegameComponent', () => {
  let component: ImagegameComponent;
  let fixture: ComponentFixture<ImagegameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagegameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagegameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
