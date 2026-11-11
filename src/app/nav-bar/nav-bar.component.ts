import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CartService } from '../cart.service';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

/** The part of the global Bootstrap bundle (loaded in index.html) used to close the mobile menu. */
interface BootstrapGlobal {
  Collapse: {
    getOrCreateInstance(element: Element, config: { toggle: boolean }): {
      hide(): void;
    };
  };
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: false,
})
export class NavBarComponent {
  cartSize: number = 0;

  @Output() addCartItemEvent = new EventEmitter<number>();

  @ViewChild('navCollapse') navCollapse?: ElementRef<HTMLElement>;

  constructor(
    private cartService: CartService,
    private httpService: HttpService,
    private router: Router
  ) {}

  checkifLoggedIn$ = this.httpService.CheckIfLoggedIn;

  ngOnInit() {
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

  /** Closes the expanded mobile menu after a link is chosen, since router navigation no longer reloads the page. */
  closeMobileMenu(): void {
    const menu = this.navCollapse?.nativeElement;
    if (!menu?.classList.contains('show')) {
      return;
    }
    const bootstrap = (window as unknown as { bootstrap?: BootstrapGlobal })
      .bootstrap;
    bootstrap?.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
  }

  signOut(): void {
    //this is needed to remmove the button from the navbar without refreshing the page, if we didnt have this the user would have to refresh the page to see the change
    this.httpService.updateCheckIfLoggedIn(false);

    this.httpService.SignOut().subscribe(() => {
      this.httpService.clearToken();
      this.cartService.CartCount.next(0);
      this.router.navigate(['/home']);
    });
  }
}
