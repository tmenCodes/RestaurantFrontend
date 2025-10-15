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
        tap((value) => {
          this.Guid = value.toString();
          localStorage.setItem('myGuid', this.Guid);
          var object = {
            guidId: this.Guid,
            name: items,
          };
          this.Http.post<any>(
            this.url + '' + 'Order/ShoppingCartItems',
            object
          ).subscribe({
            next: (data) => {
              data;
            },
            error: (error) => console.log(error),
          });

          var guid = localStorage.getItem('myGuid');

          var url = this.url + '' + 'Order/GetMenuItemByGuid?guidId=' + guid;

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
        this.url + '' + 'Order/ShoppingCartItems',
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
