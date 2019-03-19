import { JukeboxComponent } from './jukebox.component';
import {  ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('ChatbotCompenont', () => {
  let component: JukeboxComponent;
  let fixture:  ComponentFixture<JukeboxComponent>;

  // beforeEach(async(() => {
  //     TestBed.configureTestingModule({
  //         imports: [FormsModule, HttpClientModule],
  //         declarations: [ ChatbotComponent ],
  //         providers: [DialogflowService]
  //     }).compileComponents();
  // }));
  beforeEach(() => {
      fixture = TestBed.createComponent(JukeboxComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create', () => {
      expect(component).toBeDefined();
  });

  it(`should init with chatbot icon`, () => {
      const icon = fixture.debugElement.nativeElement.querySelector('.chatbot-icon');
      expect(icon).toBeTruthy();
  });

  it('should toggle chatbot icon', fakeAsync( () => {

      spyOn(component, 'toggleChat');
      const icon = fixture.debugElement.query(By.css('.chatbot-icon'));
      icon.triggerEventHandler('click', null);
      fixture.detectChanges();
      tick();
      expect(component.toggleChat).toHaveBeenCalled();
  }));



  it('submitting a form emits a msg', () => {
    });

});
