import { ErrorHandler, Injectable, Pipe } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, retry, throwError, Observable } from 'rxjs';
import { BehaviorSubject, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private Http: HttpClient, private router: Router) {}

  url: string = 'http://localhost:5182/';

  //url: string = 'http://34.224.64.48';
  //url: string = 'https://resturant.tonymdesigns.com/backend/'

  public loginBehavoir = new BehaviorSubject<boolean>(false);
  CheckIfLoggedIn = this.loginBehavoir.asObservable();

  updateCheckIfLoggedIn(changeValue: boolean) {
    this.loginBehavoir.next(changeValue);
  }

  private handleBackendDownError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  MakeUser(body: any, email: string) {
    let url = this.url + '' + 'api/RegisterUser/CreateUser';

    return this.Http.post<JSON>(url, body)
      .pipe(retry(2), catchError(this.handleBackendDownError))
      .subscribe({
        next: (data) => {
          //if the backend returns an error

          console.log(data);
          this.router.navigate(['home']);
        },
        error: (error) => {
          console.log('this is the error: ');
          console.log(error);
        },
      });
  }

  GetCartItems() {
    let urlconcat = this.url + '' + 'api/Order/PaymentInformation';
    this.Http.get<any>(urlconcat).subscribe({
      next: (data) => console.log('GET worked!'),
      error: (data) => console.log(data),
    });
  }

  InformationForm(body: any) {
    let urlconcat = this.url + '' + 'api/Order/PaymentInformation';

    return this.Http.post<any>(urlconcat, body).subscribe({
      next: (data) => this.router.navigate(['complete']),
      error: (error) => this.router.navigate(['errors']),
    });
  }

  //returns an obersvable???
  CheckEmailExist(email: string) {
    let urlconcat =
      this.url + '' + 'api/RegisterUser/CheckDuplicateEmail?email=' + email;
    console.log(urlconcat);
    //return obsevable boolean
    return this.Http.get<boolean>(urlconcat);
  }

  AddUserInformation(body: any) {
    let urlconcat =
      this.url + '' + 'api/UserInformation/AddUserPaymentInformation';

    console.log(body.value);
    this.Http.post<any>(urlconcat, body.value).subscribe({
      next: (data) => this.router.navigate(['saved']),
      error: (error) => console.log(error),
    });
  }

  EditUserInformation(email: string, InformationForm: any) {
    let urlconcant =
      this.url + '' + 'api/Auth/UpdateUserInformation?email=' + email;
    console.log(urlconcant);
    this.Http.put<any>(urlconcant, InformationForm.value).subscribe({
      next: (data) => {
        this.router.navigate(['saved']);
        console.log(data);
      },
      error: (error) => console.log(error),
    });
  }

  Login(body: Object): Observable<any> {
    let urlconcat = this.url + '' + 'api/RegisterUser/Login';

    return this.Http.post<Observable<any>>(urlconcat, body, {
      observe: 'response',
      withCredentials: true,
    });
  }

  ContactForm(body: any): void {
    let urlconcat = this.url + '' + 'api/Order/ContactInformation';
    this.Http.post<any>(urlconcat, body).subscribe({
      //change this in the future
      next: (data) => this.router.navigate(['contactcomplete']),
      error: (error) => {
        console.log(error);
        this.router.navigate(['errors']);
      },
    });
  }

  BookForm(body: any): void {
    let urlconcat = this.url + '' + 'api/Order/BookingInformation';
    this.Http.post(urlconcat, body, { responseType: 'text' }).subscribe({
      next: (data) => this.router.navigate(['bookingcomplete']),
      error: (error) => {
        console.log(error);
        this.router.navigate(['errors']);
      },
    });
  }

  public CheckIfUserLoggedIn(): Observable<any> {
    let urlconcat = this.url + '' + 'api/RegisterUser/IsUserLoggedIn';

    return this.Http.get<any>(urlconcat, {
      withCredentials: true,
    }).pipe(
      catchError((value) => {
        return of(false);
      })
    );
  }

  // public GetUserInformation(): Observable<any> {
  //   let urlconcat = this.url + '' + 'api/RegisterUser/GetTheCurrentUsers';

  //   return this.Http.get<any>(urlconcat, {
  //     withCredentials: true,
  //   });
  // }

  public SignOut() {
    let urlconcat = this.url + '' + 'api/RegisterUser/SignOut';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Or 'text/plain' if sending plain text
    });

    return this.Http.post(urlconcat, null, {
      headers: headers,
      responseType: 'text',
      withCredentials: true,
    });
  }

  public GetUserPaymentInformation(): Observable<any> {
    let urlconcat =
      this.url + '' + 'api/UserInformation/GetUserPaymentInformation';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Or 'text/plain' if sending plain text
    });

    return this.Http.get(urlconcat, {
      headers: headers,
      withCredentials: true,
    });
  }
}


