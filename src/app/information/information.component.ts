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
  toggleButton: boolean = false;
  oppositetogglebutton: boolean = !this.toggleButton;

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
    CartItems: new FormArray([]),
    UserName: new FormControl(localStorage.getItem('user')),
  });

  Token: string = localStorage.getItem('id_token')!;
  Username: string = localStorage.getItem('user')!;

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
  get CartItems() {
    return this.InformationForm.get('CartItems');
  }
  get UserName() {
    return this.InformationForm.get('UserName');
  }
  constructor(
    private cartService: CartService,
    private Router: Router,
    private Http: HttpClient,
    private HttpService: HttpService
  ) {}
  displayArray: any[] = [];
  priceArray: any[] = [];
  finalprice: number = 0;
  finalpricestring: string = '0';
  conversion: any[] = [];
  UserNameFrontend: string = localStorage.getItem('user')!;

  Items: string[] = [];

  submitInformation() {
    this.displayArray = this.cartService
      .getCartItems()
      .map((x: any) => JSON.parse(x));
    let displayItem = this.displayArray.map((p: any) => Object.values(p));

    for (var i = 0; i < displayItem.length; i++) {
      let price = displayItem[i][1];
      let item = displayItem[i][0];
      //populate the formarray
      let cart = this.InformationForm.get('CartItems') as FormArray;
      cart.push(new FormControl({ item: item, price: price }));
      this.Items.push(cart.value[i].item);
      //  let formarrayPrice = cart.value[i].price;
      console.log(this.Items);
    }

    this.cartItems = {
      name: this.InformationForm.value.NameonCard,
      items: this.Items,
      prices: parseFloat('10'),
    };



    //gets submitted in the for loop, but if an error is thrown break it
    this.HttpService.MenuForm(this.cartItems).subscribe({
      next: (data) => {
        this.displayArray = [];
        this.priceArray = [];
        this.finalprice = 0;
        this.finalpricestring = '0';
        this.conversion = [];
        localStorage.removeItem('myItemList');
        localStorage.removeItem('myItemSize');
        localStorage.clear();
        //   window.location.reload();
        //  this.Router.navigate(['complete']);
      },

      error: (error) => {
        console.log('it has errors!');
      },
    });
  }

  cartSize: number = 0;

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
                console.log('this is the value inside ' + value);

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
  cartiszero: boolean = true;
  cartItems: any = {};

  ngOnInit(): void {


    this.cartService
      .getTotalPrice()
      .subscribe((value) => (this.finalpricestring = value.totalPrice));



    this.cartService.getAllCartItems().subscribe((value) => {
      this.cartSize = value.length - 1;
      if (value.length > 0) {
        this.cartgreaterthenzero = true;
        this.cartiszero = false;
        this.displayArray = value;
        console.log(this.displayArray);
      }
    });

    if (!this.Token) {
      console.log('not logged in');
      this.oppositetogglebutton = false;
    }
    //if the user is logged in
    if (this.Token && this.UserName) {
      this.HttpService.GetUserInformationByEmail(
        this.InformationForm,
        this.Token,
        this.Username
      ).subscribe({
        next: (data) => {
          console.log(this.toggleButton);
          this.toggleButton = data;
        },
      });
    }
  }
}
