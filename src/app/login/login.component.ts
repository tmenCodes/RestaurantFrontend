import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { map, tap, pipe, mergeMap, filter } from 'rxjs';

import { checkEmailExistsValidator } from '../check-email-exists.validator';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  constructor(
    private HttpService: HttpService,
    private Http: HttpClient,

    private Router: Router
  ) {}

  LogInForm = new FormGroup({
    Email: new FormControl(
      '',
      [Validators.required, Validators.email],
      checkEmailExistsValidator.createValidator(this.HttpService)
    ),
    Password: new FormControl('', Validators.required),
  });

  get Email() {
    return this.LogInForm.get('Email');
  }

  get Password() {
    return this.LogInForm.get('Password');
  }

  onSubmit() {
    let username = this.LogInForm.value.Email!;
    let password = this.LogInForm.value.Password;

    const LoginInformation = {
      email: username,
      password: password,
    };

    this.HttpService.Login(LoginInformation)
      .pipe(
        mergeMap((value) => {
          this.HttpService.setToken(value.body.token);
          this.HttpService.updateCheckIfLoggedIn(true);

          this.Router.navigateByUrl('/userinfo');
          //   this.Router.navigate(['userinfo']);
          return value.body.message;
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.HttpService.CheckIfUserLoggedIn()
      .pipe(filter((value) => value === true))
      .subscribe(() => this.Router.navigate(['/userinfo']));
  }
}
