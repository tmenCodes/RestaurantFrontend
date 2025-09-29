import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {HttpClient} from "@angular/common/http"; 
import { HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { map, tap, pipe, mergeMap } from 'rxjs';

import { CheckEmailExistsValidator } from '../check-email-exists.validator';
import { HttpService } from '../http.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
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
      CheckEmailExistsValidator.createValidator(this.HttpService)
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
          //  console.log(value.body.succeeded);
          this.HttpService.updateCheckIfLoggedIn(value.body.succeded);
          //send this value onto
          localStorage.setItem('login', value.body.succeeded);

          this.Router.navigateByUrl('/userinfo');
          //   this.Router.navigate(['userinfo']);
          return value.body.succeeded;
        })
      )
      .subscribe();
  }

  ngOnInit() {}
}






