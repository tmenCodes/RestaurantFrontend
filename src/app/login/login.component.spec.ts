import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent, loginErrorMessage } from './login.component';
import { HttpService } from '../http.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpService: jasmine.SpyObj<HttpService>;
  let router: Router;

  const credentials = { email: 'jane@example.com', password: 'Str0ng!Pass' };

  const failWith = (status: number, body: string) =>
    httpService.Login.and.returnValue(
      throwError(() => new HttpErrorResponse({ status, error: body }))
    );

  const submit = (): HTMLElement => {
    component.loginForm.setValue(credentials);
    component.onSubmit();
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  beforeEach(() => {
    httpService = jasmine.createSpyObj<HttpService>('HttpService', [
      'Login',
      'setToken',
      'updateCheckIfLoggedIn',
      'CheckIfUserLoggedIn',
      'checkEmailExist',
    ]);
    httpService.CheckIfUserLoggedIn.and.returnValue(of(false));

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [{ provide: HttpService, useValue: httpService }],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not call the API for an incomplete form', () => {
    component.onSubmit();
    fixture.detectChanges();

    expect(httpService.Login).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('.field-error').length).toBe(2);
  });

  it('does not look up whether an email is registered while typing', () => {
    component.email.setValue('someone@example.com');
    expect(httpService.checkEmailExist).not.toHaveBeenCalled();
    expect(component.email.valid).toBeTrue();
  });

  it('stores the token and opens the account page on success', () => {
    httpService.Login.and.returnValue(
      of({ body: { token: 'abc', message: 'Login successful' } })
    );

    submit();

    expect(httpService.Login).toHaveBeenCalledOnceWith(credentials);
    expect(httpService.setToken).toHaveBeenCalledWith('abc');
    expect(httpService.updateCheckIfLoggedIn).toHaveBeenCalledWith(true);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/userinfo');
  });

  it('shows the API message for a wrong password', () => {
    failWith(401, 'Invalid email or password.');

    const page = submit();

    expect(page.querySelector('.login-error')?.textContent).toContain(
      'Invalid email or password.'
    );
    expect(component.submitting).toBeFalse();
  });

  it('shows the lockout message', () => {
    failWith(429, 'Account is locked. Try again later.');

    expect(submit().querySelector('.login-error')?.textContent).toContain(
      'Account is locked. Try again later.'
    );
  });
});

describe('loginErrorMessage', () => {
  it('explains when the server cannot be reached', () => {
    expect(loginErrorMessage(new HttpErrorResponse({ status: 0 }))).toBe(
      "Can't reach the server. Please try again."
    );
  });

  it('uses the API text for 400', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: 'Email and password are required.',
    });
    expect(loginErrorMessage(error)).toBe('Email and password are required.');
  });

  it('falls back to a generic message for server errors', () => {
    const error = new HttpErrorResponse({ status: 500, error: 'stack trace' });
    expect(loginErrorMessage(error)).toBe(
      'Something went wrong. Please try again.'
    );
  });
});
