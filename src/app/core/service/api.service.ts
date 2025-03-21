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
    return this.http.post(subUrl, params);
  }

  apiGet(subUrl: string): Observable<any> {
    return this.http.get(subUrl)
  }


  
  updateRefreshToken(subUrl: string,  params: any): Observable<any> {
    const options = { withCredentials: true };
    return this.http.post(subUrl, params, options);
   }

  

}
