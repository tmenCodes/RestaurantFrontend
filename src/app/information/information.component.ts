import { Component, ErrorHandler } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormControlName, Validators, FormArray, Form }from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpService } from '../http.service';
import { catchError, throwError, pipe, tap, delay } from 'rxjs';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'],
})
export class InformationComponent {
  InformationForm = new FormGroup({
    Credit: new FormControl('true', Validators.required),
    Debit: new FormControl('false'),
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

  get UserName() {
    return this.InformationForm.get('UserName');
  }
  constructor(private cartService: CartService, private Router: Router) {}

  displayArray: any[] = [];
  finalpricestring: string = '0';

  UserNameFrontend: string = localStorage.getItem('user')!;
  Token: string = localStorage.getItem('id_token')!;
  Username: string = localStorage.getItem('user')!;

  toggleButton: boolean = false;
  oppositetogglebutton: boolean = !this.toggleButton;

  cartSize: number = 0;
  paymentInformation: any = {};

  submitInformation() {
    var guid = localStorage.getItem('myGuid');

    this.paymentInformation = {
      credit: this.InformationForm.value.NameonCard,
      NameonCard: this.InformationForm.value.NameonCard,
      CreditCardNumber: this.InformationForm.value.CreditCardNumber,
      Expiration: this.InformationForm.value.Expiration,
      CVV: this.InformationForm.value.CVV,
      //for now use the Nameoncard as the username
      UserName: this.InformationForm.value.NameonCard,
      GuidId: guid,
    };

    this.cartService.makePayment(this.paymentInformation).subscribe({
      next(value) {
        console.log(value);
        localStorage.removeItem('myGuid');
        window.location.reload();
      },
      error(err) {
        console.log(err);
      },
    });
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
              // delay(100),
              tap((value) => {
                this.cartService.CartCount.next(value);

                this.cartService.getTotalPrice().subscribe((value) => {
        this.finalpricestring = value.totalPrice;
        console.log(this.finalpricestring);
      });

                if (value == 0) {
                  //navigat back to menu
                  this.Router.navigate(['/menu']);
                  //  window.location.reload;
                }
              })
            )
            .subscribe();
        })
      )
      .subscribe();

    var item_index = this.displayArray.findIndex((value) => value.id == i);
    this.displayArray.splice(item_index, 1);
  }

  cartgreaterthenzero: boolean = false;

  ngOnInit(): void {
    this.cartService
      .getTotalPrice()
      .subscribe((value) => (this.finalpricestring = value.totalPrice));

    this.cartService.getAllCartItems().subscribe((value) => {
      this.cartSize = value.length;
      if (value.length > 0) {
        this.cartgreaterthenzero = true;
        this.displayArray = value;
      }
    });

    if (!this.Token) {
      this.oppositetogglebutton = false;
    }
    //   if the user is logged in
    // if (this.Token && this.UserName) {
    //   this.HttpService.GetUserInformationByEmail(
    //     this.InformationForm,
    //     this.Token,
    //     this.Username
    //   ).subscribe({
    //     next: (data) => {
    //       console.log(this.toggleButton);
    //       this.toggleButton = data;
    //     },
    //   });
    // }
  }
}
