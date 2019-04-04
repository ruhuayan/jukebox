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
  let img = new Image(); 
  let thumbs = [];
  
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
    img.src = component.imgs[0];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "Image Game"', () => {
    titleService = TestBed.get(Title);
    expect(titleService.getTitle()).toBe('Image Game');
  });

  it('should load an image which width > 300', () => {
    
    img.onload = () => {
      expect(img.width).toBeGreaterThan(300);
    }
  });

  it('should have 9 thumbs and shuffle at init', () => {
    img.onload = () => {
      thumbs = fixture.nativeElement.querySelectorAll('.canvas-wrap');
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

  it('should be able to show number', () => {
  
    img.onload = () => {
      component.showNumber();
      //const thumbs = fixture.nativeElement.querySelectorAll('.canvas-wrap');
      let numberShowed = true;
      for (let i = 0; i < thumbs.length; i++) {
        if (thumbs[i].querySelector('.canvas-num')) {
          numberShowed = false;
        }
      }
      expect(numberShowed).toBe(true);
    }
  });

  // it('should compose an image', () => {
  //   img.onload = () => {
  //     component.showImage();
  //     thumbs.forEach(thumb => {
  //       console.log(getComputedStyle(thumb))
  //     })
  //   }
  // });

  // it('should undescribe on Destroy', () => {
  //   //component.ngOnDestroy();
  // });

});
