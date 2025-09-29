import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../cart.service';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http.service';
import { Router, NavigationEnd } from '@angular/router';
import { map, tap, filter, Subscription } from 'rxjs';

import { Observable, debounceTime } from 'rxjs';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
    standalone: false
})
export class NavBarComponent {
  cartSize: number = 0;
  showLogin: boolean = true;
  showUserInfo: boolean = false;
  showLogOut: boolean = false;

  //retrieve the child component
  @Output() addCartItemEvent = new EventEmitter<number>();
  // private routerSubscription: Subscription = this.Router.events
  //   .pipe(filter((event) => event instanceof NavigationEnd))
  //   .subscribe();

  public LoginInCheck: Observable<boolean> = this.Httpservice.CheckIfLoggedIn;

  constructor(
    private cartService: CartService,
    private Httpservice: HttpService,
    private Router: Router
  ) {
    this.Router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Update navbar elements based on the new route or state

        this.LoginInCheck.subscribe();
        let loggedIn = localStorage.getItem('login');
        console.log('the current status of the loggin ' + loggedIn);

        if (loggedIn === 'true') {
          this.showLogOut = true;
          this.showUserInfo = true;
          this.showLogin = false;
        }
        //  this.updateNavbar();
      }
    });
  }

  SignOut(event: Event): void {
    console.log('from the signout');
    this.Httpservice.SignOut().subscribe((value) => {
      this.showLogin = true;
      this.showUserInfo = false;
      localStorage.removeItem('login');
      window.location.reload();
      //   this.Router.navigate(['/home']);
    });
  }

  ngOnInit() {
    this.cartService.getCartSize().subscribe({
      next: (value) => {
        this.cartService.CartCount.next(value.length);
      },
    });

    this.cartService.CartCount.subscribe({
      next: (value) => {
        this.cartSize = value;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
