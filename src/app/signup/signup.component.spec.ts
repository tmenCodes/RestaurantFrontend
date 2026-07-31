import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { SignupComponent } from './signup.component';
import { HttpService } from '../http.service';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj('HttpService', [
      'CreateNewUser',
      'CheckEmailExist',
      'CheckIfUserExists',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Default async validators return false (no duplicates)
    httpServiceSpy.CheckEmailExist.and.returnValue(of(false));
    httpServiceSpy.CheckIfUserExists.and.returnValue(of(false));

    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: HttpService, useValue: httpServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: HttpClient, useValue: {} },
      ],
    });

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize with four controls', () => {
      expect(component.SignUpForm.contains('FullName')).toBeTrue();
      expect(component.SignUpForm.contains('UserName')).toBeTrue();
      expect(component.SignUpForm.contains('Email')).toBeTrue();
      expect(component.SignUpForm.contains('Password')).toBeTrue();
    });

    it('should be invalid when empty', () => {
      expect(component.SignUpForm.invalid).toBeTrue();
    });

    it('should initialize errorMessage as null', () => {
      expect(component.errorMessage).toBeNull();
    });
  });

  describe('Form validation', () => {
    it('should require FullName', () => {
      const control = component.SignUpForm.get('FullName')!;
      control.setValue('');
      expect(control.hasError('required')).toBeTrue();
    });

    it('should require UserName', () => {
      const control = component.SignUpForm.get('UserName')!;
      control.setValue('');
      expect(control.hasError('required')).toBeTrue();
    });

    it('should require Email', () => {
      const control = component.SignUpForm.get('Email')!;
      control.setValue('');
      expect(control.hasError('required')).toBeTrue();
    });

    it('should reject invalid email format', () => {
      const control = component.SignUpForm.get('Email')!;
      control.setValue('not-an-email');
      expect(control.hasError('email')).toBeTrue();
    });

    it('should accept a valid email format', () => {
      const control = component.SignUpForm.get('Email')!;
      control.setValue('test@example.com');
      expect(control.hasError('email')).toBeFalse();
      expect(control.hasError('required')).toBeFalse();
    });

    it('should require Password', () => {
      const control = component.SignUpForm.get('Password')!;
      control.setValue(null);
      expect(control.hasError('required')).toBeTrue();
    });

    it('should be valid when all required fields are filled with valid data', fakeAsync(() => {
      component.SignUpForm.setValue({
        FullName: 'John Doe',
        UserName: 'johndoe',
        Email: 'john@example.com',
        Password: 'Password1' as any,
      });
      tick(300); // allow async validators to settle
      expect(component.SignUpForm.valid).toBeTrue();
    }));
  });

  describe('Getters', () => {
    it('should return the Email control', () => {
      expect(component.Email).toBe(component.SignUpForm.get('Email'));
    });

    it('should return the Password control', () => {
      expect(component.Password).toBe(component.SignUpForm.get('Password'));
    });

    it('should return the PasswordConfirm control (undefined when not in form)', () => {
      expect(component.PasswordConfirm).toBeNull();
    });
  });

  describe('Async validators', () => {
    it('should set EmailDuplicate error when email already exists', fakeAsync(() => {
      httpServiceSpy.CheckEmailExist.and.returnValue(of(true));
      const control = component.SignUpForm.get('Email')!;
      control.setValue('taken@example.com');
      tick(300);
      expect(control.hasError('EmailDuplicate')).toBeTrue();
    }));

    it('should not set EmailDuplicate error when email is available', fakeAsync(() => {
      httpServiceSpy.CheckEmailExist.and.returnValue(of(false));
      const control = component.SignUpForm.get('Email')!;
      control.setValue('available@example.com');
      tick(300);
      expect(control.hasError('EmailDuplicate')).toBeFalse();
    }));

    it('should set UserNameDuplicate error when username already exists', fakeAsync(() => {
      httpServiceSpy.CheckIfUserExists.and.returnValue(of(true));
      const control = component.SignUpForm.get('UserName')!;
      control.setValue('takenuser');
      tick(300);
      expect(control.hasError('UserNameDuplicate')).toBeTrue();
    }));

    it('should not set UserNameDuplicate error when username is available', fakeAsync(() => {
      httpServiceSpy.CheckIfUserExists.and.returnValue(of(false));
      const control = component.SignUpForm.get('UserName')!;
      control.setValue('freeuser');
      tick(300);
      expect(control.hasError('UserNameDuplicate')).toBeFalse();
    }));
  });

  describe('SubmitSignUp', () => {
    it('should navigate to userinfo on a 200 response', () => {
      const mockResponse = new HttpResponse<JSON>({ status: 200 });
      httpServiceSpy.CreateNewUser.and.returnValue(of(mockResponse));

      component.SubmitSignUp();

      expect(httpServiceSpy.CreateNewUser).toHaveBeenCalledWith(
        component.SignUpForm.value
      );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['userinfo']);
      expect(component.errorMessage).toBeNull();
    });

    it('should set errorMessage on a non-200 success response', () => {
      const mockResponse = new HttpResponse<JSON>({ status: 201, body: null as any });
      httpServiceSpy.CreateNewUser.and.returnValue(of(mockResponse));

      component.SubmitSignUp();

      expect(component.errorMessage).toBe('Unexpected error. Please try again.');
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should set errorMessage when the request errors', () => {
      httpServiceSpy.CreateNewUser.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      component.SubmitSignUp();

      expect(component.errorMessage).toBe(
        'Something went wrong. Unable to create account.'
      );
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should clear a previous errorMessage before each submission', () => {
      component.errorMessage = 'old error';
      const mockResponse = new HttpResponse<JSON>({ status: 200 });
      httpServiceSpy.CreateNewUser.and.returnValue(of(mockResponse));

      component.SubmitSignUp();

      expect(component.errorMessage).toBeNull();
    });
  });
});
