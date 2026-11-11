import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { filter } from 'rxjs';

import { HttpService } from '../http.service';

const UNREACHABLE_MESSAGE = "Can't reach the server. Please try again.";
const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';
const API_MESSAGE_STATUSES: readonly number[] = [
  HttpStatusCode.BadRequest,
  HttpStatusCode.Unauthorized,
  HttpStatusCode.TooManyRequests,
];

/**
 * Turns a failed login response into a message for the user. The API answers 400, 401 and 429 with a
 * plain-text explanation (e.g. "Invalid email or password."), which is shown as is.
 */
export function loginErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return UNREACHABLE_MESSAGE;
  }
  const apiMessage = typeof error.error === 'string' ? error.error.trim() : '';
  return API_MESSAGE_STATUSES.includes(error.status) && apiMessage
    ? apiMessage
    : FALLBACK_MESSAGE;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  errorMessage: string | null = null;
  submitting = false;

  constructor(private httpService: HttpService, private router: Router) {}

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  ngOnInit() {
    this.httpService
      .CheckIfUserLoggedIn()
      .pipe(filter((value) => value === true))
      .subscribe(() => this.router.navigate(['/userinfo']));
  }

  /** Logs in with the entered credentials, or reveals field errors when the form is incomplete. */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.errorMessage = null;
    this.submitting = true;

    this.httpService.Login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.httpService.setToken(response.body.token);
        this.httpService.updateCheckIfLoggedIn(true);
        this.router.navigateByUrl('/userinfo');
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = loginErrorMessage(error);
        this.submitting = false;
      },
    });
  }
}
