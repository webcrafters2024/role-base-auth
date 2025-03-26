import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { ApiService } from '../service/api.service';
import { LoginService } from '../service/login.service';
import { CommonService } from '../service/common.service';
import { environment } from '../../../environments/environment';


// Shared state variables for managing token refresh
let isRefreshing = false; // Flag to track if token refresh is in progress
const pendingRequests: HttpRequest<any>[] = []; // Queue for requests during refresh
const tokenRefresh$ = new BehaviorSubject<string | null>(null); // Stream for new tokens



export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject required services
  const api = inject(ApiService); // For making API calls
  const auth = inject(LoginService); // For authentication functions
  const common = inject(CommonService); // For common utilities

  // Continue with the request and catch any errors
  return next(req).pipe(
    catchError((error: any) => {
      // Only handle 401 Unauthorized errors
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handleUnauthorized(req, next, api, auth, common);
      }
      // Re-throw other errors
      return throwError(() => error);
    })
  );
};

/**
 * HANDLES UNAUTHORIZED ERRORS (401)
 * Manages the token refresh flow and request retries
 */
const handleUnauthorized = ( req: HttpRequest<any>, next: HttpHandlerFn, api: ApiService,auth: LoginService, common: CommonService): Observable<HttpEvent<any>> => {
  // If refresh already in progress, add request to queue
  if (isRefreshing) {
    pendingRequests.push(req);
    // Wait for new token and then retry
    return tokenRefresh$.pipe(
      // Filter out null values (we only want the actual token)
      filter((token): token is string => token !== null),
      // Take only the first token emission
      take(1),
      // Retry the request with new token
      switchMap((token) => next(addAuthHeader(req, token)))
    )
  }

  // Start new refresh process
  isRefreshing = true;
  tokenRefresh$.next(null); // Reset token stream

  // Call refresh token endpoint
  return api.updateRefreshToken('api/user/refresh').pipe(
    // Process successful token refresh
    switchMap(({ accessToken }) => {
      // Securely store the new token
      common.setCookie(
        environment.token,
        common.encrypt(environment.tokenKey, accessToken),
        environment.cookieExpTime
      );

      // Notify all waiting requests
      tokenRefresh$.next(accessToken);
      
      // Process all queued requests with new token
      processPendingRequests(next, accessToken);

      // Retry the original request with new token
      return next(addAuthHeader(req, accessToken));
    }),
    // Handle errors during token refresh
    catchError((error) => {
      // Force logout if refresh fails
      auth.logOut();
      return throwError(() => error);
    }),
    // Clean up after completion (success or error)
    finalize(() => {
      isRefreshing = false;
    })
  );
};

// ADDS AUTHORIZATION HEADER TO REQUEST
const addAuthHeader = (req: HttpRequest<any>, token: string): HttpRequest<any> => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
};


//PROCESSES PENDING REQUESTS WITH NEW TOKEN
const processPendingRequests = (next: HttpHandlerFn, token: string): void => {
  // Process all queued requests
  while (pendingRequests.length) {
    const request = pendingRequests.pop();
    if (request) {
      // Retry each request with new token
      next(addAuthHeader(request, token)).subscribe();
    }
  }
};