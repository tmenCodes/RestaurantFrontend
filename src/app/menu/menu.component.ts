import {
  Component,
  EventEmitter,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
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
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from '@angular/forms';

import { Subscription, Observable } from 'rxjs';

interface MenuTotalPrice {
  subTotal: string;
  taxAmount: string;
  totalPrice: string;
}

interface CartItem {
  name?: string;
  quantity?: number;
  options?: any[];
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: false,
})
export class MenuComponent {
  public GettotalPrice$: Observable<any> = this.cartService.getTotalPrice();
  public DisplayCartItems$: Observable<any> =
    this.cartService.getAllCartItems();

  constructor(
    private cartService: CartService,
    private HttpService: HttpService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  //menuForm: FormBuilder;

  sidebarOpen: boolean = false;
  cartSize: number = 0;
  cartgreaterthenzero = false;

  menuItems$: Observable<any> = this.HttpService.GetMenuItems();
  menuItemOptions$: Observable<any> = this.HttpService.GetMenuItemOptions();
  seturlString: string = '';
  allUrlPaths: string[] = [];
  menuItemOptionsArray: string[] = [];

  ngOnInit() {
    this.menuItems$.subscribe((value) => {
      for (let item of value) {
        console.log(item);
      }
    });
    //load menu options into the form array
    this.HttpService.GetMenuItemOptions().subscribe((value) => {
      for (let option of value) {
        this.menuItemOptionsArray.push(option.menuOptionName);
      }

      //make array of same size as above with boolean values to represent if the option is selected or not
      this.menuItemOptionsArray.forEach((_) => {
        this.menuOptions.push(this.fb.control(false, Validators.required));
      });
    });

    //  this.cartService.getAllCartItems().subscribe((value) => console.log(value));
    // this.HttpService.GetMenuItems().subscribe((value) => console.log(value));
  }

  // Define the form structure with controls
  menuForm = this.fb.group({
    menuItemName: new FormControl('', Validators.required),
    // quantity: new FormControl(
    //   1,
    //   [Validators.required, Validators.min(1)],
    //   Validators.max(10),
    // ),
    quantity: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.min(1), Validators.max(10)],
    }),
    menuOptions: this.fb.array([]), // Assuming you have an array of menu options
  });

  // Access form value
  //helper to get the form array
  get menuOptions(): FormArray {
    return this.menuForm.get('menuOptions') as FormArray;
  }

  addItems(item: string) {
    //  console.log(item);
    this.menuOptions.push(this.fb.control(item, Validators.required));
    console.log(this.menuForm.value);
  }

  removeItems(index: number) {
    //we'll see bro
  }

  clearModalForm() {
    this.menuForm.setControl('menuOptions', this.fb.array([]));
    this.menuForm.reset();

    this.menuForm.patchValue({
      quantity: 1,
    });

    //HACK- not sure why the form array is not clearing out
    window.location.reload();
  }

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
          this.cartService.CartCount.next(value);
          //update the async pipe
          this.GettotalPrice$ = this.cartService.getTotalPrice();
          if (value == 0) {
            this.sidebarOpen = false;
          }

          return value;
        })
      )
      .subscribe();
  }

  OpenModal(item: string) {
    this.menuForm.patchValue({ menuItemName: item });
    this.sidebarOpen = true;
  }

  SubmitCartItems() {
    var menuObject = this.menuForm.value;
    console.log(menuObject);

    //reload an add only the items you choose here before submitting to the cart service
    // if checked is true then add to the array otherwise ignore it and filter out the null values at the end
    const selectedIndexes = (this.menuForm.value.menuOptions as
      | any[]
      | undefined)!
      .map((checked: boolean, i: number) =>
        checked ? this.menuItemOptionsArray[i] : null
      )
      .filter((v: string | null) => v !== null);
    // .filter((v: number | null) => v !== null);

    console.log(selectedIndexes);

    let item: CartItem = {
      name: menuObject.menuItemName as string,
      quantity: menuObject.quantity ? Number(menuObject.quantity) : undefined,
      options: selectedIndexes,
    };

    // console.log(item);
    this.cartService
      .putItemsIntoCart(item)
      .pipe(
        switchMap(() => this.cartService.getCartSizeLength()),
        tap((value) => {
          //  this.sidebarOpen = true;
          this.menuForm.reset();
          // update async pipes
          this.GettotalPrice$ = this.cartService.getTotalPrice();

          this.DisplayCartItems$ = this.cartService.getAllCartItems();

          //update navabar
          this.cartService.CartCount.next(value);

          //the modal automatically closes becuase of the data-bs-dismiss="modal" on html-not via typescirpt
        })
      )
      .subscribe();
  }
}
