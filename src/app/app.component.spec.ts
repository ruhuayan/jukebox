import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component'
import { FooterComponent } from './footer/footer.component';
// import { ChatbotComponent } from './chatbot/chatbot.component';
// import { FormsModule } from '@angular/forms';
// import { DialogflowService } from './chatbot/dialogflow.service';
// import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { NotFoundComponent } from './pages/not-found/not-found.component';

describe('AppComponent', () => {
    let fixture:  ComponentFixture<AppComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                AppComponent, HeaderComponent, FooterComponent, NotFoundComponent
            ],
            providers: []
        }).compileComponents();
    }));
    beforeEach(async() => {
        fixture = TestBed.createComponent(AppComponent);
    });
    it('should create the app', () => {
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have header`, () => {
        const header = fixture.debugElement.query(By.css('app-header'));
        expect(header).toBeTruthy();
    });

    it(`should have footer`, () => {
        const footer = fixture.debugElement.query(By.css('app-footer'));
        expect(footer).toBeTruthy();
    });

});
