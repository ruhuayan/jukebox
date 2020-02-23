import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaceapiComponent } from './faceapi.component';
import { RouterModule } from '@angular/router';
import { PanelRightModule } from '../panel-right.module';
// import { WebWorkerService } from 'ngx-web-worker';

@NgModule({
    imports: [
        CommonModule, PanelRightModule,
        RouterModule.forChild([
            {
                path: '',
                component: FaceapiComponent
            }
        ])
    ],
    providers: [],
    declarations: [FaceapiComponent]
})
export class FaceapiModule { }
