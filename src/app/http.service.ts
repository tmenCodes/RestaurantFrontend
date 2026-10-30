import { ErrorHandler, Injectable, Pipe } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, retry, throwError, Observable } from 'rxjs';
import { BehaviorSubject, of, tap, map } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

export const TOKEN_KEY = 'id_token';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private Http: HttpClient, private router: Router) {}

  url: any = environment.url;
  //url: string = 'http://34.224.64.48';
  //url: string = 'https://resturant.tonymdesigns.com/backend/'

  //this behavoir is to update the behavior when theu user logs out
  public loginBehavoir = new BehaviorSubject<boolean>(this.checkIfLoggedIn());
  CheckIfLoggedIn = this.loginBehavoir.asObservable();

  //a user is considered logged in when a non-expired JWT is present
  checkIfLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode<{ exp?: number }>(token);
      return decoded.exp === undefined || decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

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
    // Return an observable with a user-facing error message
    //general error outside of status code
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  createNewUser(body: any) {
    let url = this.url + '' + 'api/RegisterUser/CreateUser';
    console.log(body);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.Http.post<JSON>(url, body, {
      headers,
      observe: 'response',
    }).pipe(
      tap((response) => console.log('CreateNewUser response:', response)),
      retry(2),
      catchError(this.handleBackendDownError)
    );
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
  checkEmailExist(email: string) {
    let checkDuplicateEmailUrl =
      this.url + '' + 'api/RegisterUser/CheckDuplicateEmail?email=' + email;

    //return obsevable boolean
    return this.Http.get<boolean>(checkDuplicateEmailUrl);
  }

  CheckIfUserExists(username: string) {
    let urlconcant =
      this.url + '' + 'api/RegisterUser/FindByUser?username=' + username;
    return this.Http.get<boolean>(urlconcant);
  }

  AddUserInformation(body: any) {
    let urlconcat =
      this.url + '' + 'api/UserInformation/AddUserPaymentInformation';
    console.log('from inside the obsevable');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Or 'text/plain' if sending plain text
    });
    console.log(body.value);

    this.Http.post<any>(urlconcat, body.value, {
      headers: headers,
      withCredentials: true,
    }).subscribe({
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
    let urlconcat = this.url + '' + 'api/Misc/CustomerInquiry';
    this.Http.post<any>(urlconcat, body).subscribe({
      //change this in the future
      next: (data) => this.router.navigate(['contactcomplete']),
      error: (error) => {
        console.log(error);
        this.router.navigate(['errors']);
      },
    });
  }

  BookReservation(body: any): void {
    let urlconcat = this.url + '' + 'api/Misc/BookingInformation';
    this.Http.post(urlconcat, body, { responseType: 'text' }).subscribe({
      next: (data) => this.router.navigate(['bookingcomplete']),
      error: (error) => {
        console.log(error);
        this.router.navigate(['errors']);
      },
    });
  }

  public CheckIfUserLoggedIn(): Observable<any> {
    const urlconcat = `${this.url}api/RegisterUser/IsUserLoggedIn`;

    return this.Http.get<any>(urlconcat, { withCredentials: true }).pipe(
      // map automatically wraps the returned value back into the main stream
      tap((value) => console.log('Login check response:', value)),
      map((value) => value),
      catchError((error) => {
        // Handle the error and return a fallback value or rethrow
        console.error('Login check failed:', error);
        return of(null);
      })
    );
  }

  public GetCurrentUser(): Observable<any> {
    let urlconcat = this.url + '' + 'api/RegisterUser/GetTheCurrentUser';

    return this.Http.get<any>(urlconcat, {
      withCredentials: true,
    });
  }

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

  public UpdateUserPaymentInformation(body: any) {
    let urlconcat =
      this.url + '' + 'api/UserInformation/UpdateUserPaymentInformation';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Or 'text/plain' if sending plain text
    });

    return this.Http.put(urlconcat, body, {
      headers: headers,
      withCredentials: true,
    });
  }

  public GetPastOrders() {
    let urlconcat = this.url + '' + 'api/UserInformation/UserHistoryPayments';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.Http.get(urlconcat, {
      headers: headers,
      withCredentials: true,
    });
  }

  public GetMenuItems(): Observable<any> {
    let urlconcat = this.url + '' + 'api/Order/GetMenuItems';
    console.log(urlconcat);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.Http.get(urlconcat, {
      headers: headers,
      withCredentials: true,
    });
  }

  public GetMenuItemOptions(): Observable<any> {
    let urlconcat = this.url + '' + 'api/Order/GetMenuItemOptions';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.Http.get(urlconcat, {
      headers: headers,
      withCredentials: true,
    });
  }

  public GetImageUrlPath(): Observable<any> {
    //let urlconcat = this.url + '' + 'api/Order/GetImageUrlPath';
    // let urlconcat = this.url + '' + 'api/Order/ImagePath?menuItemName=' + path;
    let urlconcat = this.url + '' + 'api/Order/ImagePath';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.Http.get(urlconcat, {
      headers: headers,
      withCredentials: true,
    });
  }
}
