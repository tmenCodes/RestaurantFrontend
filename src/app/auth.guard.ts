import { HttpService } from './http.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(HttpService); // Inject AuthService
  const router = inject(Router);

  let observable$ = service.CheckIfUserLoggedIn().pipe(
    map((value) => {
      if (value == true) {
        console.log('from the auth guard');
        console.log(value);
        return true;
      } else {
        router.navigate(['/home']);
        console.log('bad route');
        console.log(value);
        return value;
      }
    })
  );

  return observable$;
};
