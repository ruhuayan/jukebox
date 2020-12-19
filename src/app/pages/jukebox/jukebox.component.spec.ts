import { JukeboxComponent } from './jukebox.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { PanelRightModule } from '../panel-right.module';
import { UploaderModule } from 'src/app/uploader/uploader.module';
import { HttpClientModule } from '@angular/common/http';

import { JukeService } from './model/jukebox.service';
import { Title } from '@angular/platform-browser';

describe('JukeboxCompenont', () => {
    let component: JukeboxComponent;
    let fixture: ComponentFixture<JukeboxComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [PanelRightModule, UploaderModule, , HttpClientModule],
            declarations: [JukeboxComponent],
            providers: [JukeService, Title]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(JukeboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    //   it('should create', () => {
    //       expect(component).toBeDefined();
    //   });

    //   it(`should init with chatbot icon`, () => {
    //       const icon = fixture.debugElement.nativeElement.querySelector('.chatbot-icon');
    //       expect(icon).toBeTruthy();
    //   });

    //   it('should toggle chatbot icon', fakeAsync( () => {

    //       spyOn(component, 'toggleChat');
    //       const icon = fixture.debugElement.query(By.css('.chatbot-icon'));
    //       icon.triggerEventHandler('click', null);
    //       fixture.detectChanges();
    //       tick();
    //       expect(component.toggleChat.toHaveBeenCalled());
    //   }));


});
