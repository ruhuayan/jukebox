import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagegameComponent } from './imagegame.component';
import { Title } from '@angular/platform-browser';
import { UploaderModule } from 'src/app/uploader/uploader.module';
import { PanelRightModule } from '../panel-right.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
// import { Subscription } from 'rxjs/internal/Subscription';
// import { Observable } from 'rxjs/internal/Observable';

describe('ImagegameComponent', () => {
  let component: ImagegameComponent;
  let fixture: ComponentFixture<ImagegameComponent>;
  let titleService: Title;
  const img = new Image();
  let thumbs = [];

  interface OnLoadAble {
    onload: any;
  }
  function onload2promise<T extends OnLoadAble>(obj: T): Promise<T> {
      return new Promise(resolve => {
      obj.onload = () => resolve(obj);
    });
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UploaderModule, PanelRightModule, HttpClientModule, RouterTestingModule],
      declarations: [ ImagegameComponent ],
      providers: [Title]
    })
    .compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(ImagegameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    img.src = component.imgs[0];
    await onload2promise(img);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should not show numbers`, () => {
    expect(component.numberShow).toBe(false);
  });

  it(`has array of 3 valid images`, async() => {
    expect(component.imgs.length).toBe(3);

    img.src = component.imgs[1];
    await onload2promise(img);
    expect(img).toBeTruthy();

    img.src = component.imgs[2];
    await onload2promise(img);
    expect(img).toBeTruthy();
  });

  it('should have title "Image Game"', () => {
    titleService = TestBed.get(Title);
    expect(titleService.getTitle()).toBe('Image Game');
  });

  it('should load an image which width > 300', () => {
    expect(img.width).toBeGreaterThan(300);
  });

  it(`should have 25 thumbs and shuffle at init`, () => {

    thumbs = fixture.nativeElement.querySelectorAll('.canvas-wrap');
    let shuffled = false;
    for (let i = 0; i < thumbs.length; i++) {
      if (thumbs[i].getAttribute('data-ori') !== thumbs[i].getAttribute('data-num')) {
        shuffled = true;
        break;
      }
    }
    expect(shuffled).toBe(true);
    expect(thumbs.length).toBe(component.row **2);
  });

  it(`should change format / rows`, () => {
    
    component.changeFormat(3);
    expect(component.numOfCan.length).toBe(0);
    setTimeout(() => {
      expect(component.numOfCan.length).toBe(9);
      expect(component.row).toBe(3);
    }, 0);

  });

  it('should be able to show number', () => {

      component.showNumber();
      let numberShowed = true;
      for (let i = 0; i < thumbs.length; i++) {
        if (thumbs[i].querySelector('.canvas-num')) {
          numberShowed = false;
        }
      }
      expect(numberShowed).toBe(true);
  });

  it('should compose an image', async() => {
    const row = component.row;
    const th = Math.floor(img.height / row), tw = Math.floor(img.width / row);
    component.showImage();
    await fixture.whenStable();
    fixture.detectChanges();

    thumbs.forEach(thumb => {
      // getComputedStyle(thumb, null).getPropertyValue('marginLeft') - does not work 
      const marginLeft = thumb.style.marginLeft; 
      const marginTop = thumb.style.marginTop;
      const num = +thumb.getAttribute('data-num'); 
      const marginLeftExpected = num < row ** 2 ? (tw + 1) * (num % row) : (tw + 1) * row;
      const marginTopExpected = num < row ** 2 ? (th + 1) * Math.floor(num / row) : (th + 1) * (row - 1);

      expect(marginLeft).toBe(marginLeftExpected + 'px');
      expect(marginTop).toBe(marginTopExpected + 'px');
    });
  });

  it('should undescribe on Destroy', () => {
    // const imageMock = [500, 500];
    // const imgSubscription = new Subscription();
    // const imgObservable = new Observable<[]>();
    // const spy = spyOn(imgSubscription, 'unsubscribe').and.callThrough();
    // spyOn(imgObservable, 'subscribe').and.callFake((fn: Function): Subscription => {
    //   fn(imageMock);
    //   return imgSubscription;
    // });

    // component.imgSubscription = new Subscription();
    // const subscription = spyOn(component.imgSubscription, 'unsubscribe');

    // component.ngOnDestroy();
    // expect(subscription).toHaveBeenCalled();
  });
  
});
