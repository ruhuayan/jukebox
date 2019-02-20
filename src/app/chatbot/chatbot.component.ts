import { Component, OnInit, Input, HostBinding } from '@angular/core';
// import { Message } from './message.model';
import { DialogflowService } from './dialogflow.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: 'chatbox.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  messages: Message[] = [new Message('Hi', null, 'chatbot')];
  message: Message = new Message('', null, 'user');
  @HostBinding('class.show') show = true;
  constructor(private dialogService: DialogflowService) { }
  ngOnInit() {}

  public sendMessage(): void {
    this.message.timestamp = null;
    this.messages.push(this.message);

    this.dialogService.getResponse(this.message.content).subscribe(res => {
      if (res && res['result'] && res['result']['fulfillment']){
        this.messages.push(
          new Message(res['result']['fulfillment']['speech'],  null, 'chatbot')
        );
      }
    });

    this.message = new Message('', null);
  }
  closeChat() {
    this.show = false;
  }
}
class Message {
  sender: string;
  content: string;
  timestamp: Date;

  constructor(content: string, timestamp: Date, sender: string = 'user'){
    this.content = content;
    this.timestamp = timestamp;
    this.sender = sender;
  }
}