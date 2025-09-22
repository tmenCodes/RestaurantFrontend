import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../cart.service';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  cartSize: number = 0;
  showLogin: boolean = true;
  showUserInfolink: boolean = false;
  showLogOut: boolean = false;

  //retrieve the child component
  @Output() addCartItemEvent = new EventEmitter<number>();

  constructor(
    private cartService: CartService,
    private Httpservice: HttpService,
    private Router: Router
  ) {}

  SignOut(event: Event): void {
    console.log('from the signout');
    this.Httpservice.SignOut().subscribe((value) => {
      this.showLogin = true;
      this.showUserInfolink = false;
      this.Httpservice.updateTurnOnButton(false);
      this.Router.navigate(['/home']);
    });
  }

  ngOnInit() {
    this.cartService.getCartSize().subscribe({
      next: (value) => {
        if (value > 0) {
          this.cartService.CartCount.next(value.length);
        }
      },
      // error: (error: any) => {
      //   //  console.log(error);
      // },
    });

    this.cartService.CartCount.subscribe({
      next: (value) => {
        this.cartSize = value;
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.Httpservice.CheckIfLoggedIn()
      .pipe(
        map((value) => {
          if (value == true) {
            //  this.Router.navigate(['/userinfo']);
            this.showLogin = false;
            this.showUserInfolink = true;
            this.Httpservice.updateTurnOnButton(true);
            return true;
          } else {
            return false;
          }
        })
      )
      .subscribe({
        next: (value) => console.log('this is the return value' + value),
        // error: (error) => console.log(error),
      });

    this.Httpservice.TurnonSignOutButton.subscribe((value) => {
      this.showLogOut = value;

      console.log(value);
    });
  }
}
