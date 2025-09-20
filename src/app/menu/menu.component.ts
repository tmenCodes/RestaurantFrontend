import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../cart.service';
import {
  switchMap,
  map,
  tap,
  delay,
  of,
  mergeMap,
  catchError,
  throwError,
} from 'rxjs';
import { HttpService } from '../http.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  constructor(
    private cartService: CartService,
    private HttpService: HttpService,
    private CookieService: CookieService
  ) {}

  sidebarOpen: boolean = false; // Initial state: sidebar closed

  cartSize: number = 0;

  //create event from child to parent

  subtotal: string = '';
  taxamount: string = '';
  totalprice: string = '';

  displayArray: any = [];
  cartgreaterthenzero = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen; // Toggle the state
  }

  closeNav() {
    this.sidebarOpen = false;
  }

  removeIndex(index: number) {
    this.cartService
      .RemoveMenuItem(index)
      .pipe(
        mergeMap((_) => {
          return this.cartService.getCartSizeLength();
        }),
        mergeMap((value) => {
          console.log(value);
          this.cartService.CartCount.next(value);

          this.cartService.getTotalPrice().subscribe((value) => {
            this.subtotal = value.subTotal;
            this.taxamount = value.taxAmount;
            this.totalprice = value.totalPrice;

            var item_index = this.displayArray.findIndex(
              (value: any) => value.id == index
            );
            this.displayArray.splice(item_index, 1);
          });
          return value;
        })
      )
      .subscribe((value) => console.log('this is the ifnal value' + value));
  }

  PutIntoCart(item: string) {
    this.sidebarOpen = true;

    this.cartService
      .putItemsIntoCart(item)
      .pipe(
        //correct way is NOT implement a delay though...USE MERGEMAP
        delay(100),
        tap((value) => {
          this.cartService
            .getCartSizeLength()
            .pipe(
              tap((value) => {
                this.cartService.CartCount.next(value);

                this.cartService.getTotalPrice().subscribe((value) => {
                  this.subtotal = value.subTotal;
                  this.taxamount = value.taxAmount;
                  this.totalprice = value.totalPrice;
                });

                this.cartService.getAllCartItems().subscribe((value) => {
                  this.cartSize = value.length;

                  if (value.length > 0) {
                    this.cartgreaterthenzero = true;
                    this.displayArray = value;
                  }
                });
              })
            )
            .subscribe({
              next: (value) => console.log(value),
              //   error: (error) => console.log(error),
            });
        })
      )
      .subscribe({
        next: (value) => console.log(value),
        //  error: (error) => console.log('from the menu' + error),
      });
  }

  ngOnInit(): void {
    this.HttpService.CheckIfLoggedIn();

    this.cartService
      .getTotalPrice()
      .subscribe((value) => (this.subtotal = value.totalPrice));

    this.cartService.getAllCartItems().subscribe({
      next: (value) => {
        this.cartSize = value.length;

        if (value.length > 0) {
          this.cartgreaterthenzero = true;
          this.displayArray = value;
        }
      },
      //  error: (error) => {
      //  console.log(error);
      // },
    });
  }
}
