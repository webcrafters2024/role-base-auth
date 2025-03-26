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


  apiPost(subUrl: string, params: any,): Observable<any> {
    const options = { withCredentials: true };
    return this.http.post(subUrl, params, options);
  }

  apiGet(subUrl: string): Observable<any> {
    return this.http.get(subUrl)
  }


  
  updateRefreshToken(subUrl: string): Observable<any> {
    const options = { withCredentials: true };
    return this.http.get(subUrl,  options);
   }

  

}
