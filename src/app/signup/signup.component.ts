import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, filter, map, of, take } from 'rxjs';

import { confirmPasswordValidator } from '../confirm-password.validator';
import { HttpService } from '../http.service';
import { checkEmailExistsValidator } from '../check-email-exists.validator';

/** Same rules as the API's ASP.NET Core Identity password policy. */
export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
export const USERNAME_PATTERN = /^[a-zA-Z0-9\-._@+]+$/;

const UNREACHABLE_MESSAGE = "Can't reach the server. Please try again.";
const FALLBACK_MESSAGE = 'Something went wrong. Unable to create account.';

interface IdentityError {
  description?: string;
}

/**
 * Turns a failed sign-up response into a message for the user. The API answers 400 with either a plain-text
 * message (e.g. "Email already in use.") or a list of Identity errors, whose descriptions are joined.
 */
export function signupErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return UNREACHABLE_MESSAGE;
  }
  if (error.status !== HttpStatusCode.BadRequest) {
    return FALLBACK_MESSAGE;
  }
  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error.trim();
  }
  if (Array.isArray(error.error)) {
    const descriptions = (error.error as IdentityError[])
      .map((item) => item.description?.trim())
      .filter((text): text is string => !!text);
    if (descriptions.length) {
      return descriptions.join(' ');
    }
  }
  return FALLBACK_MESSAGE;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: false,
})
export class SignupComponent {
  readonly signUpForm = new FormGroup(
    {
      fullName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      userName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(USERNAME_PATTERN)],
        asyncValidators: [
          checkEmailExistsValidator.checkDuplicateNameValidator(this.http),
        ],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
        asyncValidators: [checkEmailExistsValidator.createValidator(this.http)],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(PASSWORD_PATTERN)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: [confirmPasswordValidator] }
  );

  errorMessage: string | null = null;
  submitting = false;

  constructor(private http: HttpService, private router: Router) {}

  get fullName() {
    return this.signUpForm.controls.fullName;
  }
  get userName() {
    return this.signUpForm.controls.userName;
  }
  get email() {
    return this.signUpForm.controls.email;
  }
  get password() {
    return this.signUpForm.controls.password;
  }
  get confirmPassword() {
    return this.signUpForm.controls.confirmPassword;
  }

  /** True once the confirmation has been touched and differs from the password. */
  get passwordMismatch(): boolean {
    return (
      this.confirmPassword.touched &&
      this.signUpForm.hasError('passwordMismatch')
    );
  }

  /**
   * Creates the account once validation (including the duplicate checks still in flight) has finished;
   * reveals every field's error when the form is invalid.
   */
  submitSignUp(): void {
    if (this.submitting) {
      return;
    }
    this.signUpForm.markAllAsTouched();
    this.errorMessage = null;
    this.submitting = true;

    this.whenValidated().subscribe((valid) => {
      if (valid) {
        this.createAccount();
      } else {
        this.submitting = false;
      }
    });
  }

  private whenValidated(): Observable<boolean> {
    const settled$ = this.signUpForm.pending
      ? this.signUpForm.statusChanges.pipe(
          filter((status) => status !== 'PENDING'),
          take(1)
        )
      : of(this.signUpForm.status);
    return settled$.pipe(map((status) => status === 'VALID'));
  }

  private createAccount(): void {
    const { confirmPassword, ...account } = this.signUpForm.getRawValue();
    this.http.createNewUser(account).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (error: HttpErrorResponse) => {
        this.errorMessage = signupErrorMessage(error);
        this.submitting = false;
      },
    });
  }
}
