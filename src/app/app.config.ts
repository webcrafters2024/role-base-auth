import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpconfigInterceptor } from './core/interceptor/httpconfig.interceptor';
import { jwtInterceptor } from './core/interceptor/jwt.interceptor';
import { errorInterceptor } from './core/interceptor/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
   // provideHttpClient()  ko import karna zaroori hai, 
   // warna HttpClient ka use karne par error milega
   //  — HTTP service available nahi hogi.
    provideHttpClient(withInterceptors([httpconfigInterceptor, jwtInterceptor, errorInterceptor])),
  
  ]

  
};
