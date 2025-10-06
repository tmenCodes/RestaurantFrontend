import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../confirm-password.validator';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router'; 
import { CheckEmailExistsValidator } from '../check-email-exists.validator';


 interface UserInfo {
  Email: string, 
  Password?: string, 
  PasswordConfirm?: string
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: false,
})
export class SignupComponent {
  constructor(
    private Http: HttpService,
    private HttpClient: HttpClient,
    private Router: Router
  ) {}

  //Url: string = 'https://localhost:7004/api/Auth/SignUp';

  SignUpForm = new FormGroup(
    {
      FullName: new FormControl('', Validators.required),
      UserName: new FormControl(
        '',
        [Validators.required],
        CheckEmailExistsValidator.CheckDuplicateNameValidator(this.Http)
      ),
      Email: new FormControl(
        '',
        [Validators.required, Validators.email],
        CheckEmailExistsValidator.createValidator(this.Http)
      ),
      // Password: new FormControl('', Validators.required),
      Password: new FormControl(null, Validators.required),
      //   PasswordConfirm: new FormControl('', Validators.required),
    }
    // {
    //   validators: [confirmPasswordValidator],
    // }
  );

  get Email() {
    return this.SignUpForm.get('Email');
  }

  get Password() {
    return this.SignUpForm.get('Password');
  }

  get PasswordConfirm() {
    return this.SignUpForm.get('PasswordConfirm');
  }

  //cannot submit unless the form is free of errors....
  SubmitSignUp() {
    var SignUpForm = this.SignUpForm.value;
    this.Http.CreateNewUser(SignUpForm, this.SignUpForm.value.Email!);
  }
}
