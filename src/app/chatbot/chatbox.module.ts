import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from './chatbot.component';
import { DialogflowService } from './dialogflow.service';
@NgModule({
    imports: [CommonModule,  HttpClientModule, FormsModule],
    declarations: [
        ChatbotComponent,
    ],
    exports: [
        ChatbotComponent,
    ],
    providers: [DialogflowService]
})
export class ChatbotModule {}
