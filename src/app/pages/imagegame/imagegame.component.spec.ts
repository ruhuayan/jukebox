import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagegameComponent } from './imagegame.component';
import { Title } from '@angular/platform-browser';
import { UploaderModule } from 'src/app/uploader/uploader.module';
import { PanelRightModule } from '../panel-right.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs/internal/Observable';

describe('ImagegameComponent', () => {
  let component: ImagegameComponent;
  let fixture: ComponentFixture<ImagegameComponent>;
  let titleService: Title;
  const img = new Image();
  let thumbs = [];
  let imgSubscription: Subscription;
  let imgObservable: Observable<[]>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UploaderModule, PanelRightModule, HttpClientModule, RouterTestingModule],
      declarations: [ ImagegameComponent ],
      providers: [Title]
    })
    .compileComponents();
    const imageMock = [500, 500];
    imgSubscription = new Subscription();
    imgObservable = new Observable<[]>();
    spyOn(imgSubscription, 'unsubscribe').and.callThrough();
    spyOn(imgObservable, 'subscribe').and.callFake((fn: Function): Subscription => {
      fn(imageMock);
      return imgSubscription;
    });
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

  it('should undescribe on Destroy', () => {
    fixture.detectChanges();
    component.ngOnDestroy();
    //expect(imgSubscription.unsubscribe()).toHaveBeenCalled();
  });

});
