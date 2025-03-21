import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, finalize, filter, take } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, EMPTY } from 'rxjs';


import { LoginService } from '../service/login.service'; // Adjust the import path as necessary

import { CommonService } from '../service/common.service'; // Adjust the import path as necessary
import { environment } from '../../../environments/environment';

// State variables for token refresh
let refreshInProgress = false;
const failedRequests: HttpRequest<any>[] = [];
const retrySubject = new BehaviorSubject<any>(null);
let jwtToken = '';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const apiService = inject(APIService);
  const toastService = inject(ToastService);
  const loginService = inject(LoginService);
  const commonService = inject(CommonService);

  return next(req).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return handleAuthError(req, next, apiService, toastService, loginService, commonService);
      }
      return throwError(() => new Error('Some other error occurred'));
    })
  );
};

const handleAuthError = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  apiService: APIService,
  toastService: ToastService,
  loginService: LoginService,
  commonService: CommonService
): Observable<HttpEvent<any>> => {
  if (!refreshInProgress) {
    refreshInProgress = true;
    retrySubject.next(null);

    return apiService.updateRefreshToken('api/UserManagement/RefreshToken', null).pipe(
      switchMap((res) => {
        if (res.successCode === 1) {
          jwtToken = res.result.jwtToken;
          retryFailedRequests(next, commonService, toastService, loginService);
          return retryRequest(req, next, res, commonService, toastService, loginService);
        } else {
          toastService.danger(res.message, 3000);
          loginService.logOut();
          return throwError(() => new Error('Error occurred'));
        }
      }),
      catchError((error) => {
        loginService.logOut();
        console.log('ErrorInterceptor Error:', error);
        return throwError(() => new Error('Some other error occurred'));
      }),
      finalize(() => {
        refreshInProgress = false;
      })
    );
  } else {
    addFailedRequest(req);
    return retrySubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap(() => {
        const updatedRequest = req.clone({
          setHeaders: { Authorization: `Bearer ${jwtToken}` },
        });
        retryFailedRequests(next, commonService, toastService, loginService);
        return next.handle(updatedRequest);
      })
    );
  }
};

const retryRequest = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  res: any,
  commonService: CommonService,
  toastService: ToastService,
  loginService: LoginService
): Observable<HttpEvent<any>> => {
  let updatedRequest = req;
  if (!failedRequests.includes(req)) {
    updatedRequest = addTokenHeader(req, res, commonService);
  }
  return next.handle(updatedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        toastService.warning('Token is expired, Please Login again', 3000);
        setTimeout(() => {
          loginService.logOut();
        }, 3000);
        return EMPTY;
      } else {
        return throwError(() => new Error('Some other error occurred'));
      }
    }),
    finalize(() => {
      retrySubject.next(true);
    })
  );
};

const addFailedRequest = (request: HttpRequest<any>) => {
  failedRequests.push(request);
};

const retryFailedRequests = (
  next: HttpHandlerFn,
  commonService: CommonService,
  toastService: ToastService,
  loginService: LoginService
) => {
  for (const request of failedRequests) {
    retrySubject.next(request);
  }
  failedRequests.length = 0; // Clear the array
};

const addTokenHeader = (request: HttpRequest<any>, response: any, commonService: CommonService) => {
  const encryptedJwtToken = commonService.encrypt(environment.tokenKey, response.result.jwtToken);
  commonService.setCookie(environment.token, encryptedJwtToken, environment.cookieExpTime);

  let headers = request.headers;
  if (response.result.jwtToken) {
    headers = headers.set('Authorization', `bearer ${response.result.jwtToken}`);
  }
  return request.clone({ headers });
};