import { Component, OnInit, Input, HostBinding, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DialogflowService } from './dialogflow.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-chatbot',
  templateUrl: 'chatbox.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, OnDestroy {
  private dialogSubscription: Subscription;
  @ViewChild('message') messageTA: ElementRef;
  messages: Message[] = [new Message('Hi, buddy', null, 'chatbot')];
  message: Message = new Message('', null, 'user');
  @HostBinding('class.show') show = false;

  constructor(private dialogService: DialogflowService) { }
  ngOnInit() {
    
  }

  public sendMessage(): void {
    this.message.timestamp = null;
    this.messages.push(this.message);
    this.dialogSubscription = this.dialogService.getResponse(this.message.content).subscribe(res => {
      if (res && res['result'] && res['result']['fulfillment']){
        this.messages.push(
          new Message(res['result']['fulfillment']['speech'],  null, 'chatbot')
        );
      }
    });
    this.message = new Message('', null);
  }

  ngOnDestroy() {
    this.dialogSubscription.unsubscribe();
  }
  toggleChat() {
    this.show = !this.show;
    if (this.show) {
      this.messageTA.nativeElement.show().focus();
    }
  }
}
export class Message {
  sender: string;
  content: string;
  timestamp: Date;

  constructor(content: string, timestamp: Date, sender: string = 'user'){
    this.content = content;
    this.timestamp = timestamp;
    this.sender = sender;
  }
}