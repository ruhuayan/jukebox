import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderComponent } from './uploader.component';
import { BytesPipe } from './bytesPipe';
import { HttpClientModule } from '@angular/common/http';

describe('UploaderComponent', () => {
  let component: UploaderComponent;
  let fixture: ComponentFixture<UploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ UploaderComponent, BytesPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have upload button', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.appUpload');
    expect(button).toBeTruthy();
  }); 
});
