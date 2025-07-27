import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    //HttpClient requests (jaise GET, POST, PUT, DELETE) banane ke liye 
    // — mostly API se data fetch ya send karne ke liye use krte h .
    private http: HttpClient,
  ) { }

  //Observable ek data type hai jo asynchronous data stream ko represent karta hai 
  // Sends a GET request to the given subUrl
  apiGet(subUrl: string): Observable<any> {
    return this.http.get(subUrl)
  }

  // Sends a POST request to the given subUrl with parameters and credentials
  apiPost(subUrl: string, params: any): Observable<any> {
    const options = { withCredentials: true };
    return this.http.post(subUrl, params, options);
  }

  // Sends a GET request with credentials to update the refresh token
  updateRefreshToken(subUrl: string): Observable<any> {
    const options = { withCredentials: true };
    return this.http.get(subUrl, options);
  }
}
