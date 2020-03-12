import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component'
import { FooterComponent } from './footer/footer.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { FormsModule } from '@angular/forms';
import { DialogflowService } from './chatbot/dialogflow.service';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
    let fixture:  ComponentFixture<AppComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
        imports: [
            RouterTestingModule, FormsModule, HttpClientModule
        ],
        declarations: [
            AppComponent, HeaderComponent, FooterComponent, ChatbotComponent
        ],
        providers: [DialogflowService]
        }).compileComponents();
    }));

    it('should create the app', () => {
        fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have header`, () => {
        // fixture.whenStable().then(() => {
            const header = fixture.debugElement.query(By.css('app-header'));
            expect(header).toBeTruthy();
        // });
   
    });

    it(`should have footer`, () => {
        // fixture.whenStable().then(() => {
            const footer = fixture.debugElement.query(By.css('app-footer'));
            expect(footer).toBeTruthy();
        // });
    });

});
