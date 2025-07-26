import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
  const loginService: LoginService = inject(LoginService);
  const router: Router = inject(Router);
  
  if (loginService.isLoggedIn()) {
    const userRole = loginService.getUserRole();
   
    if (route.data['roles'] && route.data['roles'].indexOf(userRole) === -1) {
      router.navigate(['']);
      return false;
    }
    // else if (route.data['roles'] && route.data['roles'].indexOf(userRole) === -1) {
    //   return false;
    // }
    return true;
  }

  router.navigate(['/login'])
  return true
};
