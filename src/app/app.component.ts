import { Component, NgZone } from '@angular/core';
import { CartService } from './cart.service';

import { Router } from '@angular/router';
import { concatWith } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RESTAURANT_INFO } from './restaurant-info';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent {
  title = 'Resturant';
  cartSize: number = 0;
  showLogin: boolean = true;
  showSignup: boolean = true;
  readonly info = RESTAURANT_INFO;

  constructor(
    private cartService: CartService,
    private Zone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {}
}
