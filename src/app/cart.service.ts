import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  constructor(private Http: HttpClient) {}

  getCart(): MenuItems[] {
    return this.Cart;
  }

  putCart(items: string) {
    //initally null, then add a new guid
    if (localStorage.getItem('myGuid') == null) {
      this.Http.get('http://localhost:5182/api/Order/CreateGuide').subscribe(
        (value) => {
          this.Guid = value.toString();

          //store guid in localstorage
          localStorage.setItem('myGuid', this.Guid);

          var object = {
            guidId: this.Guid,
            name: items,
          };

          this.Http.post<any>(
            'http://localhost:5182/api/Order/TemporaryCartItems',
            object
          ).subscribe({
            next: (data) => {
              //don't need this if we are now storing from teh backend
            },
            error: (error) => console.log(error),
          });

          var guid = localStorage.getItem('myGuid');
          var url =
            'http://localhost:5182/api/Order/GetMenuItemByGuid?guidId=' + guid;

          this.Http.get(url).subscribe((data) => {
            console.log('this i comign from the backend ');

            console.log(typeof data);
            //   this.TempItems = { Item: data.ame, Price: data.Price };
            //    this.TempCart.push(this.TempItems);

            //    localStorage.setItem('myItemList', JSON.stringify(this.TempCart));
          });
        }
      );
    } else {
      var x = localStorage.getItem('myGuid');

      var object1 = {
        guidId: x,
        name: items,
      };
      console.log(object1);

      this.Http.post<any>(
        'http://localhost:5182/api/Order/TemporaryCartItems',
        object1
      ).subscribe({
        next: (data) => {
          console.log('the post is working');
          this.TempItems = { Item: data.name, Price: data.price };
          // console.log(this.TempItems);

          //   this.TempCart.push(this.TempItems);
          //   localStorage.setItem('myItemList', JSON.stringify(this.TempCart));
        },
        error: (error) => console.log(error),
      });
    }
  }

  getAllCartItems(): Observable<any> {
    var guid = localStorage.getItem('myGuid');
    var url =
      'http://localhost:5182/api/Order/GetMenuItemByGuid?guidId=' + guid;

    return this.Http.get(url);
  }

  getCartItems(): any {
    if (localStorage.getItem('myItemList') !== null) {
      //remove brackets from the string(array)
      let removebrackets = localStorage.getItem('myItemList')!;
      removebrackets = removebrackets.substring(1);
      removebrackets = removebrackets.slice(0, -1);
      //remove after the second common in the string , make an array out of the string
      let result = removebrackets.match(/[^,]+,[^,]+/g);

      return result;
    }
  }

  RemoveMenuItem(numero: number) {
    var url = 'http://localhost:5182/api/Order/Delete?id=' + numero;

    this.Http.delete(url).subscribe((value) =>
      console.log('The delete should now work')
    );
  }

  getCartSize(): number {
    //check in local storage for correct number of items ordered
    // if (localStorage.getItem('myItemList') !== null) {
    //   let x = localStorage.getItem('myItemList')!;
    //   const split_string = x.split(',');
    //   return Math.floor(split_string.length / 2);
    // }
    // return 0;

    return 0;
  }
}
