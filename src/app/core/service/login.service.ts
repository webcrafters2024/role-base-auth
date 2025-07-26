import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private common: CommonService,
    private router: Router,
  ) { }

  // Check if the user is logged in by verifying the existence of the token and user cookies
  isLoggedIn(): boolean {
    if (this.common.getCookie(environment.user)) {
      return true;
    } else {
      return false;
    }
  }

  // Get the JWT token, decrypt it, and return the parsed object
  getToken() {
    let user = this.getUser()
    return user.token;
  }

  // Get the user data, decrypt it, and return the parsed object
  getUser() {
    let user = this.common.getCookie(environment.user);
    if (!user) {
      return null;
    }
    let userInfoDecrypt = this.common.decrypt(environment.userKey, user);
    return JSON.parse(userInfoDecrypt);
  }

  // Get the role of the user 
  getUserRole() {
    const user = this.getUser();
    return user && user.role ? user.role.toUpperCase() : null;
  }

  // Set user and token data in cookies after encrypting them
  setUserAndToken(user: any) {
    let EncrDecrUser = this.common.encrypt(environment.userKey, user);
    this.common.setCookie(environment.user, EncrDecrUser, environment.cookieExpTime);  // Set encrypted user cookie
    this.router.navigate(['/']);
  }

  logOut() {
    this.common.deleteAllCookie();  // Delete all cookies (user and token)
    this.router.navigate(['/login']);  // Navigate to the login page
  }
}
