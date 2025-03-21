

import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { LoginService } from '../service/login.service';
import { environment } from '../../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService); 
  const requestUrl = req.url;
  const currentUser = loginService.isLoggedIn();
  const refreshTokenUrl = environment.APIURL + 'api/user/refresh';

  if (currentUser && loginService.getToken()) {
    let updatedRequest = req;
    // Add Authorization header for non-refresh token requests
    if (requestUrl.startsWith(environment.APIURL) && requestUrl !== refreshTokenUrl) {
      updatedRequest = updatedRequest.clone({
        setHeaders: { Authorization: `Bearer ${loginService.getToken()}` },
      });
    }

    return next(updatedRequest);
  }

  return next(req);
};