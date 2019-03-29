import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class DialogflowService {

  private baseURL: string = environment.apiUrl;
  private token: string = environment.token;

  constructor(private http: HttpClient){}

  public getResponse(query: string){
    const data = {
      query : query,
      lang: 'en',
      sessionId: Math.round(Math.random() * 100000)
    }

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${this.token}`
        })
    };
    return this.http.post<any>(`${this.baseURL}`, data, httpOptions);
  }
}
