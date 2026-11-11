import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../http.service';
import { RESTAURANT_INFO } from '../restaurant-info';

/** Length limits for the contact form fields. */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 50 },
  subject: { min: 3, max: 100 },
  message: { min: 10, max: 1000 },
} as const;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: false,
})
export class ContactComponent {
  readonly info = RESTAURANT_INFO;
  readonly limits = CONTACT_LIMITS;

  readonly contactForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(CONTACT_LIMITS.name.min),
        Validators.maxLength(CONTACT_LIMITS.name.max),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    subject: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(CONTACT_LIMITS.subject.min),
        Validators.maxLength(CONTACT_LIMITS.subject.max),
      ],
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(CONTACT_LIMITS.message.min),
        Validators.maxLength(CONTACT_LIMITS.message.max),
      ],
    }),
  });

  constructor(private httpService: HttpService) {}

  get name() {
    return this.contactForm.controls.name;
  }
  get email() {
    return this.contactForm.controls.email;
  }
  get subject() {
    return this.contactForm.controls.subject;
  }
  get message() {
    return this.contactForm.controls.message;
  }

  /** Sends the inquiry when the form is valid; otherwise reveals every field's error. */
  submit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.httpService.ContactForm(this.contactForm.getRawValue());
  }
}
