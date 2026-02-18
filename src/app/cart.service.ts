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

  putItemsIntoCart(items: string): Observable<any> {
    let urlconcat = this.url + '' + 'Misc/CreateGuideForFrontend';

    //create guid initially, then add to cart
    if (localStorage.getItem('myGuid') == null) {
      return this.Http.get(urlconcat).pipe(
        switchMap((value) => {
          this.Guid = value.toString();
          localStorage.setItem('myGuid', this.Guid);
          var object = {
            guidId: this.Guid,
            name: items,
          };
          return this.Http.post<any>(
            this.url + '' + 'Order/ShoppingCartItems',
            object
          );
        })
      );
    } else {
      //if guid already exists, just add to the current cart
      var guid = localStorage.getItem('myGuid');
      var object = {
        guidId: guid,
        name: items,
      };
      console.log(object);
      return this.Http.post<any>(
        this.url + '' + 'Order/ShoppingCartItems',
        object
      );
    }
  }

  getAllCartItems(): Observable<any> {
    var guid = localStorage.getItem('myGuid');

    var url = this.url + '' + 'Order/GetMenuItemByGuid?guidId=' + guid;
    return this.Http.get(url);
  }

  getCartItems(): any {
    //   if (localStorage.getItem('myItemList') !== null) {
    //     //remove brackets from the string(array)
    //     let removebrackets = localStorage.getItem('myItemList')!;
    //     removebrackets = removebrackets.substring(1);
    //     removebrackets = removebrackets.slice(0, -1);
    //     //remove after the second common in the string , make an array out of the string
    //     let result = removebrackets.match(/[^,]+,[^,]+/g);
    //     return result;
    //   }
  }

  getTotalPrice(): Observable<any> {
    let guid = localStorage.getItem('myGuid');
    console.log('total price guid: ' + guid);
    let url = this.url + '' + 'Order/GetTotalPrice?guid=' + guid;
    return this.Http.get<Observable<any>>(url);
  }

  RemoveMenuItem(numero: number): Observable<any> {
    let guid = localStorage.getItem('myGuid');
    //  var url = 'http://localhost:5182/api/Order/Deletemenuitem?id=' + numero;
    var url =
      this.url + '' + 'Order/DeleteMenuItem?id=' + numero + '&guidId=' + guid;

    return this.Http.delete(url);
  }

  makePayment(PaymentInformation: any): Observable<any> {
    var url = this.url + '' + 'Payment/PaymentInformation';
    return this.Http.post<any>(url, PaymentInformation);
  }

  CartSize(): Observable<any> {
    var guid = localStorage.getItem('myGuid');
    var url = this.url + '' + 'Order/GetMenuItemByGuid?guidId=' + guid;

    return this.Http.get<Observable<any>>(url);
    // .pipe(
    //   catchError((error) => {
    //     console.log(error);
    //     return of(0);
    //   })
    // );
  }

  getCartSizeLength(): Observable<any> {
    var guid = localStorage.getItem('myGuid');
    var url = this.url + '' + 'Order/GetMenuItemByGuidSize?guidId=' + guid;

    return this.Http.get(url);
  }

  getCartVariable() {
    this.CartCount.subscribe((value) => console.log(value));
  }
}
