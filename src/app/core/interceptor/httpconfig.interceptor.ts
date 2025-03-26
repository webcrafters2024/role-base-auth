import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';


export const httpconfigInterceptor: HttpInterceptorFn = (request, next) => {
  // Store the original request URL for checking
  let requesturl = request.url;
  
  /**
   * URL HANDLING
   * Check if the request already has an absolute URL (contains 'http')
   * If not, prepend the base API URL from environment
   */
  if (requesturl.search('http') >= 0) {
    // Absolute URL detected - no modification needed
  } else {
    // Relative URL - prepend base API URL
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