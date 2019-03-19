import { Message, ChatbotComponent } from './chatbot.component';
import {  ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DialogflowService } from './dialogflow.service';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('Message', () => {
    let mes: Message;
    beforeEach(() => {
        mes = new Message('test', new Date());
    });
    it('should have default sender to user', () => {
        expect(mes.sender).toEqual('user');
    });
});

describe('ChatbotCompenont', () => {
    let component: ChatbotComponent;
    let fixture:  ComponentFixture<ChatbotComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, HttpClientModule],
            declarations: [ ChatbotComponent ],
            providers: [DialogflowService]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(ChatbotComponent);
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

    it(`message textarea invalid when empty`, () => {
        expect(component.msgForm.value.Message).toBeFalsy();
    });

    it('submitting a form emits a msg', () => { // console.log(component.msgForm);
        // expect(component.msgForm.valid).toBeFalsy();
        component.msgForm.value.message = 'test';
        expect(component.msgForm.valid).toBeTruthy();
      });

});
