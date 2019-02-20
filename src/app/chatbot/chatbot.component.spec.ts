import { Message, ChatbotComponent } from './chatbot.component';
import {  ComponentFixture, TestBed, async } from '@angular/core/testing';

describe('Message', () => {
    let mes: Message;
    beforeEach(() => {
        mes = new Message('test', new Date());
    });
    it('should have send equals to user', () => {
        expect(mes.sender).toEqual('user');
    });
});

describe('ChatbotCompenont', () => {
    let component: ChatbotComponent;
    let fixture:  ComponentFixture<ChatbotComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ChatbotComponent ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(ChatbotComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeDefined();
    })
});