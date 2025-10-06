import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor() {}
  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      //  console.log(error.status + 'for thr follwing' + error.message);
    }
  }
}
