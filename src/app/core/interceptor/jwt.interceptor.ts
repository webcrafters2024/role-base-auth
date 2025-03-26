import { HttpInterceptorFn} from '@angular/common/http';

import { inject } from '@angular/core';
import { LoginService } from '../service/login.service';
import { environment } from '../../../environments/environment';


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Injecting LoginService to access login-related information
  const loginService = inject(LoginService); 
  
  // Get the URL of the incoming HTTP request
  const requestUrl = req.url;
  
  // Check if the user is logged in by calling LoginService's isLoggedIn() method
  const currentUser = loginService.isLoggedIn();
  
  // URL endpoint for refreshing the JWT token
  const refreshTokenUrl = environment.APIURL + 'api/user/refresh';

  // Check if there is a logged-in user and a valid token exists
  if (currentUser && loginService.getToken()) {
    let updatedRequest = req;
    
    // If the request is going to the API URL (not the refresh token URL) 
    // and the user is logged in, add an Authorization header with the token
    if (requestUrl.startsWith(environment.APIURL) && requestUrl !== refreshTokenUrl) {
      updatedRequest = updatedRequest.clone({
        setHeaders: { Authorization: `Bearer ${loginService.getToken()}` },  // Add Bearer token to the header
      });
    }

    // Continue processing the request with the updated headers
    return next(updatedRequest);
  }

  // If no user is logged in, or no token is available, proceed with the original request
  return next(req);
};
