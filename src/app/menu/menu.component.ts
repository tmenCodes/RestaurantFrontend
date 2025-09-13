import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../cart.service';
import { switchMap, tap, delay, of, mergeMap, catchError } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  constructor(private cartService: CartService) {}

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
              })
            )
            .subscribe();
        })
      )
      .subscribe();

    var item_index = this.displayArray.findIndex((value: any) => value.id == i);
    this.displayArray.splice(item_index, 1);
  }

  PutIntoCart(item: string) {
    this.sidebarOpen = true;
    console.log(item);
    this.cartService
      .putItemsIntoCart(item)
      .pipe(
        //impelement slight delay-because on the backend it will be a post-then reveal the size of the array

        //correct way is NOT implement a delay though...
        delay(100),
        tap((value) => {
          this.cartService
            .getCartSizeLength()
            .pipe(
              tap((value) => {
                console.log('thie is the value from the put');
                console.log(value);
                this.cartService.CartCount.next(value);

                this.cartService.getTotalPrice().subscribe((value) => {
                  this.subtotal = value.subTotal;
                  this.taxamount = value.taxAmount;
                  this.totalprice = value.totalPrice;
                });

                this.cartService.getAllCartItems().subscribe((value) => {
                  this.cartSize = value.length;
                  console.log('the value on inigt ');
                  console.log(value);
                  if (value.length > 0) {
                    this.cartgreaterthenzero = true;
                    this.displayArray = value;
                  }
                });
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  // callonMe() {
  //   const firstObservable$ = this.cartService.getCartSizeLength().pipe(
  //     tap((value) => {
  //       console.log(value);
  //       this.cartService.CartCount.next(value);
  //     })
  //   );

  //   firstObservable$.subscribe({
  //     next: (v) => console.log(v),
  //     error: (e) => {
  //       console.log(e.error);
  //     },
  //     complete: () => console.info('complete'),
  //   });
  // }

  ngOnInit(): void {
    this.cartService
      .getTotalPrice()
      .subscribe((value) => (this.subtotal = value.totalPrice));

    this.cartService.getAllCartItems().subscribe((value) => {
      this.cartSize = value.length;
      console.log('the value on inigt ');
      console.log(value);
      if (value.length > 0) {
        this.cartgreaterthenzero = true;
        this.displayArray = value;
      }
    });
  }
}
