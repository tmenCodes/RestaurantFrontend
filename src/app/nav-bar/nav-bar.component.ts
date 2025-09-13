import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  cartSize: number = 0;
  //retrieve the child component

  @Output() addCartItemEvent = new EventEmitter<number>();

  /**
   *
   */
  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService
      .getCartSize()

      .subscribe((value) => {
        console.log('teh value ' + value);
        this.cartService.CartCount.next(value.length);
      });

    this.cartService.CartCount.subscribe((value) => {
      this.cartSize = value;
    });
  }
}
