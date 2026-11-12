import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { BookComponent } from './book.component';
import { HttpService } from '../http.service';
import { BOOKING_ROUTES } from './booking.constants';
import { toDateInputValue } from './booking-validators';

describe('BookComponent', () => {
  let component: BookComponent;
  let fixture: ComponentFixture<BookComponent>;
  let http: jasmine.SpyObj<HttpService>;
  let router: jasmine.SpyObj<Router>;

  const validBooking = () => ({
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-000-0000',
    date: toDateInputValue(new Date()),
    time: '19:00',
    people: 4,
    message: '',
  });

  beforeEach(() => {
    http = jasmine.createSpyObj<HttpService>('HttpService', ['BookReservation']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [BookComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: HttpService, useValue: http },
        { provide: Router, useValue: router },
      ],
    });
    fixture = TestBed.createComponent(BookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('exposes the time control through its getter', () => {
    expect(component.time).toBe(component.BookForm.controls.time);
  });

  it('accepts a long name', () => {
    component.name.setValue('Alexandra Montgomery-Whitfield');
    expect(component.name.valid).toBeTrue();
  });

  it('rejects guest counts outside 1–20', () => {
    component.people.setValue(0);
    expect(component.people.hasError('min')).toBeTrue();
    component.people.setValue(21);
    expect(component.people.hasError('max')).toBeTrue();
  });

  it('does not submit an invalid form and shows its errors', () => {
    component.FormSubmit();
    fixture.detectChanges();

    expect(http.BookReservation).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('.field-error').length).toBeGreaterThan(0);
  });

  it('submits a valid form once and navigates to the confirmation page', () => {
    http.BookReservation.and.returnValue(of('ok'));
    component.BookForm.setValue(validBooking());

    component.FormSubmit();

    expect(http.BookReservation).toHaveBeenCalledOnceWith(validBooking());
    expect(router.navigate).toHaveBeenCalledWith([BOOKING_ROUTES.complete]);
  });

  it('shows an inline error and keeps the form when the request fails', () => {
    http.BookReservation.and.returnValue(throwError(() => new Error('down')));
    component.BookForm.setValue(validBooking());

    component.FormSubmit();
    fixture.detectChanges();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.submitting).toBeFalse();
    expect(fixture.nativeElement.querySelector('.submit-error')).not.toBeNull();
    expect(component.name.value).toBe('Jane Smith');
  });
});
