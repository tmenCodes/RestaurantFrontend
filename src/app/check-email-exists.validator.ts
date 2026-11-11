import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpService } from './http.service';

/** How long to wait after the last keystroke before asking the API whether a value is taken. */
export const DUPLICATE_CHECK_DEBOUNCE_MS = 400;

/**
 * Builds an async validator that reports `errorKey` when `isTaken` says the value is already in use.
 * Angular cancels the previous check on every change, so the timer debounces requests while typing.
 * A failed lookup never blocks the form; the API rejects real duplicates on submit anyway.
 */
function duplicateValidator(
  isTaken: (value: string) => Observable<boolean>,
  errorKey: string
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = (control.value ?? '').trim();
    if (!value) {
      return of(null);
    }
    return timer(DUPLICATE_CHECK_DEBOUNCE_MS).pipe(
      switchMap(() => isTaken(value)),
      map((taken) => (taken ? { [errorKey]: true } : null)),
      catchError(() => of(null))
    );
  };
}

/** Sign-up validators that check the API for already registered emails and usernames. */
export class checkEmailExistsValidator {
  /** Reports `EmailDuplicate` when the email already belongs to an account. */
  static createValidator(httpService: HttpService): AsyncValidatorFn {
    return duplicateValidator(
      (email) => httpService.checkEmailExist(email),
      'EmailDuplicate'
    );
  }

  /** Reports `UserNameDuplicate` when the username is already taken. */
  static checkDuplicateNameValidator(
    httpService: HttpService
  ): AsyncValidatorFn {
    return duplicateValidator(
      (userName) => httpService.CheckIfUserExists(userName),
      'UserNameDuplicate'
    );
  }
}
