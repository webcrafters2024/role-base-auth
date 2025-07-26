import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  // Sends a POST request to the given subUrl with parameters and credentials
  apiPost(subUrl: string, params: any): Observable<any> {
    const options = { withCredentials: true };
    return this.http.post(subUrl, params, options);
  }

  // Sends a GET request to the given subUrl
  apiGet(subUrl: string): Observable<any> {
    return this.http.get(subUrl)
  }

  // Sends a GET request with credentials to update the refresh token
  updateRefreshToken(subUrl: string): Observable<any> {
    const options = { withCredentials: true };
    return this.http.get(subUrl, options);
  }
}
