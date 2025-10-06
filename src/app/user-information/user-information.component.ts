import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup,FormControl, Validators, FormArray } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import {
  map,
  Observable,
  pipe,
  tap,
  of,
  Subject,
  takeUntil,
  interval,
} from 'rxjs';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css'],
  standalone: false,
})
export class UserInformationComponent {
  constructor(
    private Http: HttpClient,
    private HttpService: HttpService,
    private router: Router
  ) {}

  username: string = '';
  subject: Subject<void> = new Subject();
  PastHistory: Observable<any> = this.HttpService.GetPastOrders();
  RandomNumbers = of(1, 2, 3, 4, 6);

  InformationForm = new FormGroup({
    cardType: new FormControl(''),
    nameonCard: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[a-zA-z\\s]*$'),
    ]),
    creditCardNumber: new FormControl(
      null,
      Validators.pattern('^[0-9]{3}(-)[0-9]{3}(-)[0-9]{4}')
    ),
    expiration: new FormControl(
      null,
      Validators.pattern('^[0-9]{2}(/)[0-9]{2}')
    ),
    cvv: new FormControl(null, [
      Validators.pattern('^[0-9]{3}'),
      Validators.minLength(3),
    ]),
    // CartItems: new FormControl(localStorage.getItem('myItemList')),
    //set form array to null?
    //  CartItems: new FormArray([]),
    //get the email or username from local storage becuase now you should be logged in
    // Email: new FormControl(localStorage.getItem('user')),
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
  updatePayMentInfo: boolean = false;
  editInformation() {
    this.InformationForm.enable();
    this.updatePayMentInfo = true;
  }

  updateUserPayment() {
    console.log(this.InformationForm.value);
    this.HttpService.UpdateUserPaymentInformation(
      this.InformationForm.value
    ).subscribe({
      next: (value) => console.log(value),
      error: (error) => console.log(error),
    });
  }

  ngOnInit() {
    // this.HttpService.GetPastOrders()
    //   .pipe(tap((value) => console.log(value)))
    //   .subscribe();

    //preload user informatoin
    this.HttpService.GetUserPaymentInformation()
      .pipe(
        tap((value) => {
          this.username = value.nameonCard;
          this.InformationForm.patchValue({
            nameonCard: value.nameonCard,
            creditCardNumber: value.creditCardNumber,
            expiration: value.expiration,
            cvv: value.cvv,
          }),
            this.InformationForm.disable();
        }),
        takeUntil(this.subject)
        //  pipe(tap((_) => console.log('whathathhtthhh')))
        // takeUntilDestroyed()
      )
      .subscribe({
        //   next: (value) => console.log(value),
        error: (error) => console.log(error),
        //     complete: () => console.log('complttttttttted'),
      });
  }

  ngOnDestroy() {
    /** a trick to continue until the component no longer recieves any values!??? */
    this.subject.next(console.error('borrororo'));
    this.subject.unsubscribe();
  }
}
