import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../cart.service';
import { switchMap, tap, delay, of, mergeMap } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  constructor(private cartService: CartService) {}

  PutIntoCart(item: string) {

    //  this.cartService.putCart(item);
    this.cartService
      .putCart2(item)
      .pipe(
        //impelement slight delay-because on the backend it will be a post-then reveal the size of the array
        delay(100),
        tap((value) => {
          this.cartService
            .getCartSizeLength()
            .pipe(
              tap((value) => {

                console.log(value);
                this.cartService.CartCount.next(value);
              })
            )
            .subscribe();
        })
      )
      .subscribe();

    //get the value of the original
    // this.cartService.CartCount.subscribe((value) => {
    //   this.cartSize = value;
    // });

    // this.cartService.CartCount.next(this.cartSize + 1);
    //pout cart is void so can't return a value ???

    // this.callonMe();

    //would have to combine all three values
  }

  callonMe() {
    //get size is inisitally not zero though
    const firstObservable$ = this.cartService.getCartSizeLength().pipe(
      tap((value) => {
        console.log(value);
        this.cartService.CartCount.next(value);
      })
    );

    firstObservable$.subscribe({
      next: (v) => console.log(v),
      error: (e) => {
        // console.error('this is the error');
        console.log(e.error);
      },
      complete: () => console.info('complete'),
    });
  }

  breakfeastTime: boolean = false;
  lunchTime: boolean = false;
  dinnerTime: boolean = false;
  cartSize: number = 0;

  //create event from child to parent

  ngOnInit(): void {
    let date = new Date();
    let hours = date.getHours();

    if (hours <= 11) {
      this.breakfeastTime = true;
      this.lunchTime = false;
      this.dinnerTime = false;
    }
    if (hours >= 12 && hours <= 14) {
      this.breakfeastTime = false;
      this.lunchTime = true;
      this.dinnerTime = false;
    }
    if (hours >= 15) {
      this.breakfeastTime = false;
      this.lunchTime = false;
      this.dinnerTime = true;
    }

    //this should work because on each page reload..the cart array will be zero. so refill cart from localstorage
    // if (this.cartService.getCartSize() > 0) {
    //   let x = this.cartService.getCartItems().map((x: any) => JSON.parse(x));
    //   let p = x.map((p: any) => Object.values(p));
    //   //put all values that were in cart, backinto the cart...
    //   for (var i = 0; i < p.length; i++) {
    //     let item = p[i][0];
    //     let price = p[i][1];
    //     this.cartService.putCart(item);
    //   }
    // }
  }
}
