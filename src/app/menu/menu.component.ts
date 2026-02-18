import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../cart.service';
import { RouterModule } from '@angular/router';
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

import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: false,
})
export class MenuComponent {
  public GettotalPrice: Observable<any> = this.cartService.getTotalPrice();
  public DisplayCartItems: Observable<any> = this.cartService.getAllCartItems();

  constructor(
    private cartService: CartService,
    private HttpService: HttpService
  ) {}

  sidebarOpen: boolean = false;
  cartSize: number = 0;
  cartgreaterthenzero = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSideBar() {
    this.sidebarOpen = false;
  }

  removeIndex(index: number) {
    this.cartService
      .RemoveMenuItem(index)
      .pipe(
        switchMap((_) => {
          return this.cartService.getCartSizeLength();
        }),
        switchMap((value) => {
          console.log(value);
          this.cartService.CartCount.next(value);
          //update the async pipe
          this.GettotalPrice = this.cartService.getTotalPrice();

          return value;
        })
      )
      .subscribe();
  }

  PutIntoCart(item: string) {
    this.sidebarOpen = true;

    this.cartService
      .putItemsIntoCart(item)
      .pipe(
        switchMap(() => this.cartService.getCartSizeLength()),
        tap((value) => {
          // update async pipes
          this.GettotalPrice = this.cartService.getTotalPrice();
          this.DisplayCartItems = this.cartService.getAllCartItems();
          // update navbar
          this.cartService.CartCount.next(value);
        })
      )
      .subscribe();
  }
}
