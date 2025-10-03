import { Component, inject } from '@angular/core';

import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { HttpService } from '../http.service';
import {
  FormControl,
  FormGroup,
  FormControlName,
  Validators,
  FormArray,
  Form,
} from '@angular/forms';

import { catchError, throwError, pipe, tap, delay, of } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: false,
})
export class CheckoutComponent {
  subtotal: string = '';
  taxamount: string = '';
  totalprice: string = '';

  InformationForm = new FormGroup({
    // Credit: new FormControl('true', Validators.required),
    // Debit: new FormControl('false'),
    CardType: new FormControl(''),
    NameonCard: new FormControl('John Doe', [
      Validators.required,
      Validators.pattern('^[a-zA-z\\s]*$'),
    ]),
    CreditCardNumber: new FormControl(
      '000-000-0000',
      Validators.pattern('^[0-9]{3}(-)[0-9]{3}(-)[0-9]{4}')
    ),
    Expiration: new FormControl(
      '12/30',
      Validators.pattern('^[0-9]{2}(/)[0-9]{2}')
    ),
    CVV: new FormControl('000', [
      Validators.pattern('^[0-9]{3}'),
      Validators.minLength(3),
    ]),
    // CartItems: new FormControl(localStorage.getItem('myItemList')),
    //CartItems: new FormArray([]),
    UserName: new FormControl(localStorage.getItem('user')),
  });

  //getter type is used for the forntend forms
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
  get UserName() {
    return this.InformationForm.get('UserName');
  }

  constructor() {}

  cartService = inject(CartService);
  Router = inject(Router);
  HttpService = inject(HttpService);

  displayArray: any[] = [];
  finalpricestring: string = '0';

  UserNameFrontend: string = localStorage.getItem('user')!;
  Token: string = localStorage.getItem('id_token')!;
  Username: string = localStorage.getItem('user')!;

  toggleButton: boolean = false;
  oppositetogglebutton: boolean = !this.toggleButton;

  cartSize: number = 0;
  paymentInformation: any = {};

  GuidValue: any = '';

  submitInformation() {
    console.log(this.InformationForm.value);

    this.paymentInformation = {
      credit: this.InformationForm.value.NameonCard,
      NameonCard: this.InformationForm.value.NameonCard,
      CreditCardNumber: this.InformationForm.value.CreditCardNumber,
      Expiration: this.InformationForm.value.Expiration,
      CVV: this.InformationForm.value.CVV,
      //for now use the Nameoncard as the username
      UserName: this.InformationForm.value.NameonCard,

      CartsIdentity: this.GuidValue,
    };

    this.cartService.makePayment(this.paymentInformation).subscribe({
      next(value) {
        localStorage.removeItem('myGuid');
      },
      error(err) {
        console.log(err);
      },
    });

    this.Router.navigate(['/complete']);
  }

  removeIndex(i: number) {
    this.cartService
      .RemoveMenuItem(i)
      .pipe(
        delay(100),
        tap((value) => {
          this.cartService
            .getCartSizeLength()
            .pipe(
              catchError((error) => {
                console.error(
                  'THIS IS THE ERROR FROM THE BACKEND:',
                  error.message
                );
                return of(0); // Return a fallback observable
              }),
              // delay(100),
              tap((value) => {
                this.cartService.CartCount.next(value);

                this.cartService.getTotalPrice().subscribe((value) => {
                  console.log(value);
                  this.subtotal = value.subTotal;
                  this.taxamount = value.taxAmount;
                  this.totalprice = value.totalPrice;
                });
                //

                if (value == 0) {
                  //navigat back to menu
                  this.Router.navigate(['/menu']);

                  //  window.location.reload;
                }
              })
            )
            .subscribe({
              next: () => console.log,
              error: (error) => console.log(error),
            });
        })
      )
      .subscribe({
        next: () => console.log,
        error: (error) => console.log(error),
      });

    var item_index = this.displayArray.findIndex((value) => value.id == i);
    this.displayArray.splice(item_index, 1);
  }

  cartgreaterthenzero: boolean = false;

  ngOnInit(): void {
    this.GuidValue = localStorage.getItem('myGuid');

    this.cartService.getTotalPrice().subscribe((value) => {
      console.log(value);
      this.subtotal = value.subTotal;
      this.taxamount = value.taxAmount;
      this.totalprice = value.totalPrice;
    });

    this.cartService.getAllCartItems().subscribe((value) => {
      console.log(value.length);
      this.cartSize = value.length;
      if (value.length > 0) {
        this.cartgreaterthenzero = true;
        this.displayArray = value;
      }
    });

    if (!this.Token) {
      this.oppositetogglebutton = false;
    }

    this.HttpService.GetUserPaymentInformation()
      .pipe(
        tap((value) => {
          console.log('this is the value');
          console.log(value);

          //   this.username = value.nameonCard;
          this.InformationForm.patchValue({
            NameonCard: value.nameonCard,
            CreditCardNumber: value.creditCardNumber,
            Expiration: value.expiration,
            CVV: value.cvv,
          }),
            this.InformationForm.disable();
        })
        // takeUntilDestroyed()
      )
      .subscribe();
  }
}
