import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private common : CommonService,
    private router : Router,
  ) { }



  isLoggedIn(): boolean {
    if (this.common.getCookie(environment.token) && this.common.getCookie(environment.user)) return true
    else return false
  }

  getToken() {
    let token = this.common.getCookie(environment.token);
      let decryptToken = this.common.decrypt(environment.tokenKey, token)
      return JSON.parse(decryptToken);
 
  }

  getUser() {
    let user = this.common.getCookie(environment.user),
      userInfoDecrypt = this.common.decrypt(environment.userKey, user)
    return JSON.parse(userInfoDecrypt);
  }

  getUserRole() {
    return this.getUser().role.toUpperCase();
  
  }

  setUserAndToken(user: any) {

    let EncrDecrUser = this.common.encrypt(environment.userKey, user)
    this.common.setCookie(environment.user, EncrDecrUser, environment.cookieExpTime)


    let EncrDecrJwtToken = this.common.encrypt(environment.tokenKey, user.token)
    this.common.setCookie(environment.token, EncrDecrJwtToken, environment.cookieExpTime)
    this.router.navigate(['/'])

  }





 


  logOut() {
    this.common.deleteAllCookie()
    this.router.navigate(['/login'])

  }

}
