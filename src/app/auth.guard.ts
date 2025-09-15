import { HttpService } from './http.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(HttpService); // Inject AuthService
    const router = inject(Router);

    let observable$ = service.CheckIfLoggedIn().pipe(
      map((value) => {
        if (value == true) {
          return true;
        } else {
          router.navigate(['/home']);
          return false;
        }
      })
    );

    return observable$; 

};
