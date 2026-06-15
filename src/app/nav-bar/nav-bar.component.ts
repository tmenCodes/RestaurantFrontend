import { Component, Output, EventEmitter } from '@angular/core';
import { CartService } from '../cart.service';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: false,
})
export class NavBarComponent {
  cartSize: number = 0;
  isLoggedIn: boolean = false;

  @Output() addCartItemEvent = new EventEmitter<number>();

  constructor(
    private cartService: CartService,
    private httpService: HttpService,
    private router: Router
  ) {}

  checkifLoggedIn$ = this.httpService.CheckIfLoggedIn;

  ngOnInit() {
    this.isLoggedIn = localStorage.getItem('login') === 'Login successful';
    this.checkifLoggedIn$.subscribe((value) => {
      console.log(value);
    });
    this.cartService
      .getCartSizeLength()
      .pipe(
        tap((value) => {
          this.cartService.CartCount.next(value);
          this.cartService.CartCount.subscribe({
            next: (count) => (this.cartSize = count),
          });
        })
      )
      .subscribe();
  }

  signOut(): void {
    //this is needed to remmove the button from the navbar without refreshing the page, if we didnt have this the user would have to refresh the page to see the change
    this.httpService.updateCheckIfLoggedIn(false);

    this.httpService.SignOut().subscribe(() => {
      localStorage.removeItem('login');
      this.isLoggedIn = false;
      this.cartService.CartCount.next(0);
      this.router.navigate(['/home']);
    });
  }
}
