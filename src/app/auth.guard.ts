import { HttpService } from './http.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(HttpService); // Inject AuthService
  return service.CheckIfLoggedIn().pipe(map((x) => x));
};
