import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class JukeService {
    private baseURL = 'http://35.203.68.143:8000/lyrics';

    constructor(private http: HttpClient) {}
    getLyrics(artist: string, title: string): Observable<any> {
        const url = `${this.baseURL}/${artist}/${title}`;
        return this.http.get(url);
    }
    // getCover(): Observable<any> {
    //     return this.http.get()
    // }
}
