import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
interface MenuItems {
  item: string;
  GuidId: string;
}

interface TempMenuItems {
  Item: string;
  Price: string;
}

interface CartItem {
  name?: string;
  quantity?: number;
  options?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  Cart: MenuItems[] = [];
  menuItem: MenuItems = { item: '', GuidId: '' };

  TempItems: TempMenuItems = { Item: '', Price: '' };
  TempCart: TempMenuItems[] = [];

  Guid: string = '';
  CartCount = new BehaviorSubject(0);

  constructor(private Http: HttpClient) {}

  url: string = environment.carturl;

  getCart(): MenuItems[] {
    return this.Cart;
  }

  putItemsIntoCart(item: CartItem): Observable<any> {
    let urlconcat = this.url + '' + 'Cart/CreateCart';

    console.log(item);

    //create guid initially, then add to cart
    if (localStorage.getItem('myGuid') == null) {
      return this.Http.get(urlconcat).pipe(
        switchMap((value) => {
          this.Guid = value.toString();
          localStorage.setItem('myGuid', this.Guid);
          var object = {
            guidId: this.Guid,
            name: item.name,
            quantity: item.quantity,
            options: item.options,
          };
          return this.Http.post<any>(
            this.url + '' + 'Cart/AddItem',
            object
          );
        })
      );
    } else {
      //if guid already exists, just add to the current cart
      var guid = localStorage.getItem('myGuid');
      var object = {
        guidId: guid,
        name: item.name,
        quantity: item.quantity,
        options: item.options,
      };
      console.log(object);
      return this.Http.post<any>(
        this.url + '' + 'Cart/AddItem',
        object
      );
    }
  }

  getAllCartItems(): Observable<any> {
    var guid = localStorage.getItem('myGuid');

    var url = this.url + '' + 'Cart/GetItems?guidId=' + guid;
    return this.Http.get(url);
  }

  getTotalPriceByGuid(): Observable<any> {
    let guid = localStorage.getItem('myGuid');

    let url = this.url + '' + 'Cart/GetTotals?guid=' + guid;
    return this.Http.get<Observable<any>>(url);
  }

  RemoveMenuItem(numero: number): Observable<any> {
    let guid = localStorage.getItem('myGuid');
    //  var url = 'http://localhost:5182/api/Order/Deletemenuitem?id=' + numero;
    var url =
      this.url + '' + 'Cart/RemoveItem?id=' + numero + '&guidId=' + guid;

    return this.Http.delete(url);
  }

  makePayment(PaymentInformation: any): Observable<any> {
    var url = this.url + '' + 'Cart/Checkout';
    return this.Http.post<any>(url, PaymentInformation);
  }

  getCartSizeLength(): Observable<any> {
    var guid = localStorage.getItem('myGuid');
    var url = this.url + '' + 'Cart/GetItemCount?guidId=' + guid;

    return this.Http.get(url);
  }

  getCartVariable() {
    this.CartCount.subscribe((value) => console.log(value));
  }
}
