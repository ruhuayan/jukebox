import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FaceapiComponent } from './faceapi.component';

describe('FaceapiComponent', () => {
  let component: FaceapiComponent;
  let fixture: ComponentFixture<FaceapiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceapiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceapiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
