import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup,FormControl, Validators, FormArray } from '@angular/forms';
import { map, Observable, pipe, tap } from 'rxjs';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css'],
})
export class UserInformationComponent {
  constructor(
    private Http: HttpClient,
    private HttpService: HttpService,
    private router: Router
  ) {}

  username: string = '';

  InformationForm = new FormGroup({
    Credit: new FormControl('true', Validators.required),
    Debit: new FormControl('false'),
    NameonCard: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[a-zA-z\\s]*$'),
    ]),
    CreditCardNumber: new FormControl(
      null,
      Validators.pattern('^[0-9]{3}(-)[0-9]{3}(-)[0-9]{4}')
    ),
    Expiration: new FormControl(
      null,
      Validators.pattern('^[0-9]{2}(/)[0-9]{2}')
    ),
    CVV: new FormControl(null, [
      Validators.pattern('^[0-9]{3}'),
      Validators.minLength(3),
    ]),
    // CartItems: new FormControl(localStorage.getItem('myItemList')),
    //set form array to null?
    CartItems: new FormArray([]),
    //get the email or username from local storage becuase now you should be logged in
    Email: new FormControl(localStorage.getItem('user')),
  });

  get Credit() {
    return this.InformationForm.get('Credit');
  }
  get Debit() {
    return this.InformationForm.get('Debit');
  }
  get NameonCard() {
    return this.InformationForm.get('NameonCard');
  }
  get CreditCardNumber() {
    return this.InformationForm.get('CreditCardNumber');
  }
  get Expiration() {
    return this.InformationForm.get('Expiration');
  }
  get CVV() {
    return this.InformationForm.get('CVV');
  }
  get Email() {
    return this.InformationForm.get('Email');
  }

  submitInformation() {
    // create a new route here
    console.log(this.InformationForm.value);
    this.HttpService.AddUserInformation(this.InformationForm);
    //add an add button
  }

  togglebutton: boolean = false;
  oppositetogglebutton: boolean = !this.togglebutton;

  editInformation() {
    console.log('edit some information here bro ');
    this.InformationForm.enable();
    // console.log(this.InformationForm.value)
    //  this.HttpService.EditUserInformation(this.Username, this.InformationForm);
  }

  ngOnInit() {
    //user may not have information at first
    this.HttpService.GetUserPaymentInformation()
      .pipe(
        tap((value) => {
          console.log(value);

          this.username = value.nameonCard;
          this.InformationForm.patchValue({
            NameonCard: value.nameonCard,
            CreditCardNumber: value.creditCardNumber,
            Expiration: value.expiration,
            CVV: value.cvv,
          }),
            takeUntilDestroyed();

          this.InformationForm.disable();
        })
      )
      .subscribe();
  }
}
