import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { BookingRequest, HttpService } from '../http.service';
import { BOOKING_LIMITS, BOOKING_ROUTES } from './booking.constants';
import {
  notInPastValidator,
  timeWithinValidator,
  toDateInputValue,
} from './booking-validators';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  standalone: false,
})
export class BookComponent {
  constructor(private Http: HttpService, private Router: Router) {}

  readonly limits = BOOKING_LIMITS;
  readonly today = toDateInputValue(new Date());
  submitting = false;
  submitError = false;

  BookForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(BOOKING_LIMITS.nameMaxLength)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(BOOKING_LIMITS.emailMaxLength),
      ],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(BOOKING_LIMITS.phonePattern)],
    }),
    date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notInPastValidator()],
    }),
    time: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        timeWithinValidator(BOOKING_LIMITS.firstSeating, BOOKING_LIMITS.lastSeating),
      ],
    }),
    people: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(BOOKING_LIMITS.minGuests),
      Validators.max(BOOKING_LIMITS.maxGuests),
    ]),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(BOOKING_LIMITS.messageMaxLength)],
    }),
  });

  get name() {
    return this.BookForm.controls.name;
  }

  get email() {
    return this.BookForm.controls.email;
  }

  get phone() {
    return this.BookForm.controls.phone;
  }

  get date() {
    return this.BookForm.controls.date;
  }

  get time() {
    return this.BookForm.controls.time;
  }

  get people() {
    return this.BookForm.controls.people;
  }

  get message() {
    return this.BookForm.controls.message;
  }

  /** Shows every validation error, or sends the reservation once if the form is valid. */
  FormSubmit() {
    this.BookForm.markAllAsTouched();
    if (this.BookForm.invalid || this.submitting) {
      return;
    }

    this.submitting = true;
    this.submitError = false;
    this.Http.BookReservation(this.BookForm.getRawValue() as BookingRequest)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: () => this.Router.navigate([BOOKING_ROUTES.complete]),
        error: () => (this.submitError = true),
      });
  }
}
