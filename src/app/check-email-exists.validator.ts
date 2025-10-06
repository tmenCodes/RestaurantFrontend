import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
  } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map,  } from 'rxjs/operators';


import { HttpService } from './http.service';  

  export class CheckEmailExistsValidator {
    static createValidator(HttpService: HttpService): AsyncValidatorFn {
      return (
        control: AbstractControl
      ): Observable<ValidationErrors | null> => {
        return HttpService.CheckEmailExist(control.value).pipe(
          map((result: boolean) => {
            return result ? { EmailDuplicate: true } : null;
          })
        );
      };
    }

    static CheckDuplicateNameValidator(
      HttpService: HttpService
    ): AsyncValidatorFn {
      return (
        control: AbstractControl
      ): Observable<ValidationErrors | null> => {
        return HttpService.CheckIfUserExists(control.value).pipe(
          map((result: boolean) => {
            return result ? { UserNameDuplicate: true } : null;
          })
        );
      };
    }
  }
