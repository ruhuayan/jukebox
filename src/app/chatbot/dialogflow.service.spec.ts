import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DialogflowService } from './dialogflow.service';
import { Message } from './chatbot.component';
import { environment } from '../../environments/environment';

describe('DialogflowService', () => {
  let injector: TestBed;
  let service: DialogflowService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DialogflowService]
    });
    injector = getTestBed();
    service = injector.get(DialogflowService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  }); 

  it(`should send a msg & receive a msg `, () => {
    const dummyResponse = {
        "id": "b3db6e2b-b21a-40fe-8fb1-bed28b07329a",
        "timestamp": "2019-02-22T22:10:30.947Z",
        "lang": "en",
        "result": {
          "source": "agent",
          "resolvedQuery": "hi",
          "action": "input.welcome",
          "actionIncomplete": false,
          "parameters": {},
          "contexts": [],
          "metadata": {
            "intentId": "2224256d-3303-43eb-8a4f-4a9afa6a08c3",
            "webhookUsed": "false",
            "webhookForSlotFillingUsed": "false",
            "isFallbackIntent": "false",
            "intentName": "Default Welcome Intent"
          },
          "fulfillment": {
            "speech": "Good day! What can I do for you today?",
            "messages": [
              {
                "type": 0,
                "speech": "Greetings! How can I assist?"
              }
            ]
          },
          "score": 1.0
        },
        "status": {
          "code": 200,
          "errorType": "success"
        },
        "sessionId": "87930"
      }
    const api_url = environment.apiUrl;
    const msg = new Message('test', new Date(), 'user');
    service.getResponse(msg.content).subscribe( res => { 
        expect(res['status']['code']).toEqual(200);
        expect(res['result']['fulfillment']['speech']).toBeTruthy();
    });
    const req = httpMock.expectOne(api_url);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });
});