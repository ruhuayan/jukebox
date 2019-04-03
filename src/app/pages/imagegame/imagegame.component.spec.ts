import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagegameComponent } from './imagegame.component';
import { Title } from '@angular/platform-browser';
import { UploaderModule } from 'src/app/uploader/uploader.module';
import { PanelRightModule } from '../panel-right.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('ImagegameComponent', () => {
  let component: ImagegameComponent;
  let fixture: ComponentFixture<ImagegameComponent>;
  let titleService : Title;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UploaderModule, PanelRightModule, HttpClientModule, RouterTestingModule],
      declarations: [ ImagegameComponent ], 
      providers: [Title]
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

  it('should have title "Image Game"', () => {
    titleService = TestBed.get(Title);
    expect(titleService.getTitle()).toBe('Image Game');
  });

  it('should load an image which width > 300', () => {
    const img = new Image();
    img.src = component.imgs[0];
    img.onload = () => {
      expect(img.width).toBeGreaterThan(300);
    }
  });

  it('should have 9 thumbs and shuffle at init', () => {
    const img = new Image();
    img.src = component.imgs[0];
    img.onload = () => {
      const thumbs = fixture.nativeElement.querySelectorAll('.canvas-wrap');
      let shuffled = false;
      for (let i = 0; i < thumbs.length; i++) {
        if (thumbs[i].getAttribute('data-ori') !== thumbs[i].getAttribute('data-num')) {
          shuffled = true;
          break;
        }
      }
      expect(shuffled).toBe(true);
      expect(thumbs.length).toBe(9);
    }
  });

  it('should undescribe on Destroy', () => {

  });

});
