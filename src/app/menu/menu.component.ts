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
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  public GettotalPrice: Observable<any> = this.cartService.getTotalPrice();
  public DisplayCartItems: Observable<any> = this.cartService.getAllCartItems();

  constructor(
    private cartService: CartService,
    private HttpService: HttpService,
    private CookieService: CookieService
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
        mergeMap((_) => {
          return this.cartService.getCartSizeLength();
        }),
        mergeMap((value) => {
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
        mergeMap(() => {
          return this.cartService.getCartSizeLength();
        }),
        mergeMap((value) => {
          //update for the navbar
          this.cartService.CartCount.next(value);
          // update async pipe
          this.GettotalPrice = this.cartService.getTotalPrice();

          //update async pipe
          this.DisplayCartItems = this.cartService.getAllCartItems();

          return value;
        })
      )
      .subscribe();
  }

  ngOnInit() {}
}
