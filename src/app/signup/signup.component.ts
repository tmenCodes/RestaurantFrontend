import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../confirm-password.validator';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { checkEmailExistsValidator } from '../check-email-exists.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: false,
})
export class SignupComponent {
  constructor(private http: HttpService, private router: Router) {}

  signUpForm = new FormGroup(
    {
      fullName: new FormControl('', Validators.required),
      userName: new FormControl('', {
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-._@+]+$/)],
        asyncValidators: [
          checkEmailExistsValidator.checkDuplicateNameValidator(this.http),
        ],
        updateOn: 'blur',
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [checkEmailExistsValidator.createValidator(this.http)],
        updateOn: 'blur',
      }),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/
        ),
      ]),
    }
    // {
    //   validators: [confirmPasswordValidator],
    // }
  );

  get userName() {
    return this.signUpForm.get('userName');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
    return this.signUpForm.get('password');
  }

  errorMessage: string | null = null;

  //cannot submit unless the form is free of errors....
  submitSignUp() {
    this.errorMessage = null;

    var formValue = this.signUpForm.value;
    console.log(this.signUpForm.value);

    this.http.createNewUser(formValue).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.router.navigate(['login']);
        } else {
          this.errorMessage = 'Unexpected error. Please try again.';
        }
      },
      error: (value) => {
        this.errorMessage = 'Something went wrong. Unable to create account.';
      },
    });
  }
}
