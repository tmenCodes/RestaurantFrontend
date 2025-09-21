import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';

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

  getCart(): MenuItems[] {
    return this.Cart;
  }

  putItemsIntoCart(items: string): Observable<any> {
    //initially thea value is null
    //check local storage each time
    if (localStorage.getItem('myGuid') == null) {
      return this.Http.get('http://localhost:5182/CreateGuideForFrontend').pipe(
        tap((value) => {
          this.Guid = value.toString();
          localStorage.setItem('myGuid', this.Guid);
          var object = {
            guidId: this.Guid,
            name: items,
          };
          this.Http.post<any>(
            'http://localhost:5182/api/Order/ShoppingCartItems',
            object
          ).subscribe({
            next: (data) => {
              data;
            },
            error: (error) => console.log(error),
          });

          var guid = localStorage.getItem('myGuid');
          var url =
            'http://localhost:5182/api/Order/GetMenuItemByGuid?guidId=' + guid;

          this.Http.get(url).subscribe((data) => {});
        })
      );
    } else {
      var x = localStorage.getItem('myGuid');

      var object1 = {
        guidId: x,
        name: items,
      };

      return this.Http.post<any>(
        'http://localhost:5182/api/Order/ShoppingCartItems',
        object1
      );
      // .subscribe({
      //   next: (data) => {
      //     // console.log('the post is working');
      //     this.TempItems = { Item: data.name, Price: data.price };
      //   },
      //   error: (error) => console.log(error),
      // });
    }
  }

  getAllCartItems(): Observable<any> {
    var guid = localStorage.getItem('myGuid');

    var url =
      'http://localhost:5182/api/Order/GetMenuItemByGuid?guidId=' + guid;
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
    let url = 'http://localhost:5182/api/Order/GetTotalPrice?guid=' + guid;
    return this.Http.get<Observable<any>>(url);
  }

  RemoveMenuItem(numero: number): Observable<any> {
    let guid = localStorage.getItem('myGuid');
    //  var url = 'http://localhost:5182/api/Order/Deletemenuitem?id=' + numero;
    var url =
      'http://localhost:5182/api/Order/DeleteMenuItem?id=' +
      numero +
      '&guidId=' +
      guid;

    return this.Http.delete(url);
  }

  makePayment(PaymentInformation: any): Observable<any> {
    var url = 'http://localhost:5182/api/Payment/PaymentInformation';
    return this.Http.post<any>(url, PaymentInformation);
  }

  getCartSize(): Observable<any> {
    var guid = localStorage.getItem('myGuid');
    var url =
      'http://localhost:5182/api/Order/GetMenuItemByGuid?guidId=' + guid;

    return this.Http.get<Observable<any>>(url);
  }

  getCartSizeLength(): Observable<any> {
    var guid = localStorage.getItem('myGuid');
    var url =
      'http://localhost:5182/api/Order/GetMenuItemByGuidSize?guidId=' + guid;

    return this.Http.get(url);
  }

  getCartVariable() {
    this.CartCount.subscribe((value) => console.log(value));
  }
}
