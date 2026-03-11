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

import {
  catchError,
  pipe,
  tap,
  delay,
  of,
  mergeMap,
  switchMap,
  combineLatest,
} from 'rxjs';

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
  username: string = '';
  GuidValue: any = '';

  /* prettier-ignore */
  submitInformation() {
    this.HttpService.GetCurrentUser()
      .pipe(
        mergeMap((value) => {
          //never goes in here
          this.paymentInformation = {
            credit: this.InformationForm.value.NameonCard,
            NameonCard: this.InformationForm.value.NameonCard,
            CreditCardNumber: this.InformationForm.value.CreditCardNumber,
            Expiration: this.InformationForm.value.Expiration,
            CVV: this.InformationForm.value.CVV,
            UserName: value.userName,
            CartsIdentity: this.GuidValue,
          };
          console.log('IT SHOULD NOT BE GOING HERE!');
          console.log(value.userName);

          return this.cartService.makePayment(this.paymentInformation).pipe(
            tap((value) => {
              localStorage.removeItem('myGuid');
              this.Router.navigate(['/complete']);
            })
          );
        }),
          //catches error from the first observable
          catchError((_) => {
            //never goes in here
            this.paymentInformation = {
              credit: this.InformationForm.value.NameonCard,
              NameonCard: this.InformationForm.value.NameonCard,
              CreditCardNumber: this.InformationForm.value.CreditCardNumber,
              Expiration: this.InformationForm.value.Expiration,
              CVV: this.InformationForm.value.CVV,
              UserName: 'undefined',
              CartsIdentity: this.GuidValue,
            };

            return this.cartService.makePayment(this.paymentInformation).pipe(
              tap((_) => {
                localStorage.removeItem('myGuid');
                this.Router.navigate(['/complete']);
              })
            );
          })
      )
      .subscribe({
        next: (value) => console.log(value),
        error: (error) => console.log(error),
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
    console.log(this.displayArray);
  }

  cartgreaterthenzero: boolean = false;

  ngOnInit(): void {
    this.GuidValue = localStorage.getItem('myGuid');

    this.cartService.getTotalPrice().subscribe((value) => {
      this.subtotal = value.subTotal;
      this.taxamount = value.taxAmount;
      this.totalprice = value.totalPrice;
    });

    this.cartService.getAllCartItems().subscribe((value) => {
      console.log(value.length);
      this.cartSize = value.length;
      if (value.length > 0) {
        this.cartgreaterthenzero = true;
        // this.displayArray = value;
        // console.log(value);
      }
    });

    var obs1$ = this.cartService.getAllCartItems();
    var obs2$ = this.HttpService.GetMenuItems();

    combineLatest([obs1$, obs2$]).subscribe(([val1, val2]) => {
      console.log(val1, val2);

      var newObject = {};
      //use map or filter
      for (let i = 0; i < val1.length; i++) {
        for (let z = 0; z < val2.length; z++) {
          //   console.log(val1[i]);
          if (val2[z].menuItemName == val1[i].name) {
            // console.log(val1[i]);
            //console.log(val2[z].menuItemBasePrice);
            newObject = { ...val1[i], basePrice: val2[z].menuItemBasePrice };
            //  console.log(newObject);
            this.displayArray.push(newObject);
            console.log(this.displayArray);
          }
        }
      }

      // let x = val1.filter((cartItem: any) => {
      //   if (cartItem.menuItemName == val1.name) {
      //     console.log(val1.name);
      //   }
      // });
    });

    //   this.cartService
    //     .getAllCartItems()
    //     .pipe(switchMap((value) => {this.HttpService.GetMenuItems()
    //       .pipe(
    //         tap((menuItems) => {
    //           console.log(value)
    //             console.log(menuItems)
    //           })
    //         })
    //       )
    //       })

    //     .subscribe();
    // });

    if (!this.Token) {
      this.oppositetogglebutton = false;
    }

    //load user  payment info
    this.HttpService.GetUserPaymentInformation()
      .pipe(
        tap((value) => {
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

  checkBaseValue(name: string): string {
    let nameString: string = '';
    console.log('woah');
    // this.HttpService.GetMenuItems().subscribe((value) => {
    //   var item = value.find((value: any) => value.menuItemName == name);
    //   console.log(item);
    //   if (item) {
    //     nameString = item.basePrice;
    //   }
    // });
    return nameString;
  }
}
