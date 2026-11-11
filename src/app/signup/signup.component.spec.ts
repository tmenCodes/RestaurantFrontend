import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SignupComponent, signupErrorMessage } from './signup.component';
import { CreatedAccount, HttpService } from '../http.service';
import { DUPLICATE_CHECK_DEBOUNCE_MS } from '../check-email-exists.validator';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpService: jasmine.SpyObj<HttpService>;
  let router: Router;

  const account = {
    fullName: 'Ada Lovelace',
    userName: 'ada',
    email: 'ada@example.com',
    password: 'Str0ng!Pass',
  };

  const created = new HttpResponse<CreatedAccount>({
    status: 200,
    body: { message: 'User created successfully', username: 'ada', email: 'ada@example.com' },
  });

  const fillValidForm = () =>
    component.signUpForm.setValue({ ...account, confirmPassword: account.password });

  const settleDuplicateChecks = () => tick(DUPLICATE_CHECK_DEBOUNCE_MS);

  const render = (): HTMLElement => {
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  beforeEach(() => {
    httpService = jasmine.createSpyObj<HttpService>('HttpService', [
      'createNewUser',
      'checkEmailExist',
      'CheckIfUserExists',
    ]);
    httpService.checkEmailExist.and.returnValue(of(false));
    httpService.CheckIfUserExists.and.returnValue(of(false));
    httpService.createNewUser.and.returnValue(of(created));

    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [{ provide: HttpService, useValue: httpService }],
    });
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validation', () => {
    it('is valid once every field is filled correctly', fakeAsync(() => {
      fillValidForm();
      settleDuplicateChecks();
      expect(component.signUpForm.valid).toBeTrue();
    }));

    it('requires a password with upper, lower, digit and symbol', () => {
      component.password.setValue('weakpass');
      expect(component.password.hasError('pattern')).toBeTrue();
      component.password.setValue('Str0ng!Pass');
      expect(component.password.valid).toBeTrue();
    });

    it('rejects usernames with spaces', () => {
      component.userName.setValue('ada lovelace');
      expect(component.userName.hasError('pattern')).toBeTrue();
    });

    it('flags a confirmation that does not match', () => {
      component.password.setValue('Str0ng!Pass');
      component.confirmPassword.setValue('Different1!');
      component.confirmPassword.markAsTouched();

      expect(component.passwordMismatch).toBeTrue();
      expect(render().textContent).toContain("Passwords don't match.");
    });
  });

  describe('duplicate checks', () => {
    it('waits for typing to pause before asking the API', fakeAsync(() => {
      component.email.setValue('a');
      component.email.setValue('ad');
      component.email.setValue('ada@example.com');
      expect(httpService.checkEmailExist).not.toHaveBeenCalled();

      settleDuplicateChecks();
      expect(httpService.checkEmailExist).toHaveBeenCalledOnceWith('ada@example.com');
    }));

    it('shows when an email already has an account', fakeAsync(() => {
      httpService.checkEmailExist.and.returnValue(of(true));
      component.email.setValue('ada@example.com');
      settleDuplicateChecks();

      expect(component.email.hasError('EmailDuplicate')).toBeTrue();
      expect(render().textContent).toContain('An account with this email already exists.');
    }));

    it('shows when a username is taken', fakeAsync(() => {
      httpService.CheckIfUserExists.and.returnValue(of(true));
      component.userName.setValue('ada');
      settleDuplicateChecks();

      expect(render().textContent).toContain('That username is already taken.');
    }));

    it('does not block sign-up when the lookup fails', fakeAsync(() => {
      httpService.checkEmailExist.and.returnValue(throwError(() => new Error('down')));
      component.email.setValue('ada@example.com');
      settleDuplicateChecks();

      expect(component.email.valid).toBeTrue();
    }));
  });

  describe('submitting', () => {
    it('shows every error and sends nothing for an empty form', () => {
      component.submitSignUp();
      const page = render();

      expect(httpService.createNewUser).not.toHaveBeenCalled();
      expect(page.querySelectorAll('.field-error').length).toBe(5);
      expect(component.submitting).toBeFalse();
    });

    it('waits for pending duplicate checks, then creates the account', fakeAsync(() => {
      fillValidForm();
      component.submitSignUp();
      expect(httpService.createNewUser).not.toHaveBeenCalled();

      settleDuplicateChecks();

      expect(httpService.createNewUser).toHaveBeenCalledOnceWith(account);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('never sends the confirmation field', fakeAsync(() => {
      fillValidForm();
      settleDuplicateChecks();
      component.submitSignUp();

      const sent = httpService.createNewUser.calls.mostRecent().args[0];
      expect(Object.keys(sent)).not.toContain('confirmPassword');
    }));

    it('does not log the password', fakeAsync(() => {
      const log = spyOn(console, 'log');
      fillValidForm();
      settleDuplicateChecks();
      component.submitSignUp();

      expect(log).not.toHaveBeenCalled();
    }));

    it('shows the API message when the email is taken', fakeAsync(() => {
      httpService.createNewUser.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 400, error: 'Email already in use.' }))
      );
      fillValidForm();
      settleDuplicateChecks();
      component.submitSignUp();

      expect(render().querySelector('.form-error')?.textContent).toContain('Email already in use.');
      expect(component.submitting).toBeFalse();
    }));
  });
});

describe('signupErrorMessage', () => {
  it('joins Identity error descriptions', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: [
        { code: 'PasswordTooShort', description: 'Passwords must be at least 6 characters.' },
        { code: 'DuplicateUserName', description: "Username 'ada' is already taken." },
      ],
    });
    expect(signupErrorMessage(error)).toBe(
      "Passwords must be at least 6 characters. Username 'ada' is already taken."
    );
  });

  it('explains when the server cannot be reached', () => {
    expect(signupErrorMessage(new HttpErrorResponse({ status: 0 }))).toBe(
      "Can't reach the server. Please try again."
    );
  });

  it('falls back to a generic message for server errors', () => {
    expect(signupErrorMessage(new HttpErrorResponse({ status: 500, error: 'boom' }))).toBe(
      'Something went wrong. Unable to create account.'
    );
  });
});
