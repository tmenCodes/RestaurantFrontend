import { Component } from '@angular/core';
import { CartService } from './cart.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Resturant';
  cartSize: number = 0;
  showLogin: boolean = true;
  showSignup: boolean = true;

  constructor(
    private cartService: CartService,

    private router: Router
  ) {}

  LogOut() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
    localStorage.removeItem('myItemList');
    localStorage.removeItem('myItemSize');
    location.reload();
  }

  ngOnInit(): void {
    this.cartService.getCartSize().subscribe((value) => {
      this.cartSize = value.length;
    });
  }
}
