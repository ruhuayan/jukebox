import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class DialogflowService {

  private baseURL: string = "https://api.dialogflow.com/v1/query?v=20190211";
  private token: string = environment.token;

  constructor(private http: HttpClient){}

  public getResponse(query: string){
    let data = {
      query : query,
      lang: 'en',
      sessionId: '12345'
    }

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${this.token}`
        })
    };
    return this.http.post(`${this.baseURL}`, data, httpOptions);
  }
}