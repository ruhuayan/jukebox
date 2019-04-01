import { Component, OnInit, Input, HostBinding, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DialogflowService } from './dialogflow.service';
import { Subscription } from 'rxjs/internal/Subscription';
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

@Component({
  selector: 'app-chatbot',
  templateUrl: 'chatbox.component.html'
})
export class ChatbotComponent implements OnInit, OnDestroy {
  private dialogSubscription: Subscription;
  @ViewChild('msgForm') msgForm: any;
  @ViewChild('messageTA') messageTA: ElementRef;
  @ViewChild('msgList') msgList: ElementRef;
  messages: Message[] = [new Message('Hi, buddy', null, 'chatbot')];
  message: Message = new Message('', null, 'user');
  @HostBinding('class.show') show = false;

  constructor(private dialogService: DialogflowService) { }
  ngOnInit() {}

  public sendMessage(): void {
    this.message.content = this.message.content.trim();
    if (this.message.content !== '') {
      this.message.timestamp = new Date();
      this.messages.push(this.message);
      this.dialogSubscription = this.dialogService.getResponse(this.message.content).subscribe(res => {
        if (res && res['result'] && res['result']['fulfillment']) {
          this.messages.push(
            new Message(res['result']['fulfillment']['speech'],  new Date(), 'chatbot')
          );
          setTimeout(() => {this.msgList.nativeElement.querySelector('li:last-child').scrollIntoView(); }, 0);
        }
      });
      this.message = new Message('', null);
      this.messageTA.nativeElement.focus();

    }
  }

  ngOnDestroy() {
    if (this.dialogSubscription) this.dialogSubscription.unsubscribe();
  }
  toggleChat() {
    this.show = !this.show;
    if (this.show) {
      this.messageTA.nativeElement.focus();
    }
  }
  onKeydown(e){
    if (this.message.content !== '' && e.key === 'Enter') {
      e.preventDefault();
      this.sendMessage();
    }
  }
}

