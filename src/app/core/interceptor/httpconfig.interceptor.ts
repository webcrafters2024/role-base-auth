import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';


// Interceptor ek special service h jo har HTTP 
// request ya response ko intercept (rok) kar sakti hai 
// — jaise ek middleware.
// Request server tak jaane se pehle ya Response aane ke baad,
//  hum kuch modify ya check kar sakte hain.
export const httpconfigInterceptor: HttpInterceptorFn = (request, next) => {
  // Store the original request URL for checking
  let requesturl = request.url;
  
  if (requesturl.search('http') >= 0) {

  } else {
    // Relative URL - prepend base API URL
    // hum directly request ko modify nahi kar sakte
    //Agar aap usme kuch change karna chahte ho 
    // (jaise header, URL, body), to pehle uska clone banana padta hai:
    request = request.clone({ url: environment.APIURL + request.url });
  }
  // Set Content-Type to application/json if not specified
  if (!request.headers.has('Content-Type')) {
    request = request.clone({ 
      headers: request.headers.set('Content-Type', 'application/json') 
    });
  }
  // Set Accept header to application/json if not specified
  if (!request.headers.has('Accept')) {
    request = request.clone({ 
      headers: request.headers.set('Accept', 'application/json') 
    });
  }
  // Pass the modified request to the next handler in the chain
  return next(request);
};