import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  menu: any = [
    {
      id: 0,
      displayName: 'Home',
      path: '',
      role: ['USER', 'ADMIN']
    },
    {
      id: 1,
      displayName: 'Admin',
      path: 'admin',
      role: ['ADMIN']
    },
    {
      id: 3,
      displayName: 'User Info',
      path: 'user',
      role: ['USER']
    }
  ]

  constructor(private Cookie: CookieService,) { }


  public setCookie(key: string, value: string, expireTime: any) {
    this.Cookie.set(key, JSON.stringify(value), { expires: expireTime, domain: environment.domain, path: '/', sameSite: 'Lax' });
    return true
  }

  public getCookie(key: any) {
    let value: any = this.Cookie.get(key);
    try {
      return JSON.parse(value)
    }
    catch (e) {
      return null
    }
  }

  public deleteCookie(key: string) {
    this.Cookie.delete(key, '/', environment.domain);
  }

  public deleteAllCookie() {
    this.Cookie.deleteAll('/', environment.domain);
  }


  //The set method is use for encrypt the value.
  encrypt(key: any, value: any) {
    return CryptoJS.AES.encrypt(JSON.stringify(value), key).toString();
  }

  // //The get method is use for decrypt the value.
  decrypt(key: any, value: any) {
    var decryptKey = CryptoJS.AES.decrypt(value, key);
    return decryptKey.toString(CryptoJS.enc.Utf8);
  }



}
