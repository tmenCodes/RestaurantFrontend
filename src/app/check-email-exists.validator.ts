import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HttpService } from './http.service';

export class checkEmailExistsValidator {
  static createValidator(HttpService: HttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return HttpService.checkEmailExist(control.value).pipe(
        //   tap((value) => console.log('Email check response:', value)),
        map((result: boolean) => {
          return result ? { EmailDuplicate: true } : null;
        }),
        catchError((error) => {
          console.error('Email duplicate check failed:', error);
          return of(null);
        })
      );
    };
  }

  static checkDuplicateNameValidator(
    HttpService: HttpService
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return HttpService.CheckIfUserExists(control.value).pipe(
        map((result: boolean) => {
          return result ? { UserNameDuplicate: true } : null;
        }),
        catchError((error) => {
          console.error('Username duplicate check failed:', error);
          return of(null);
        })
      );
    };
  }
}
