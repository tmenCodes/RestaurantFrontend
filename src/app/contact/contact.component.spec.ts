import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CONTACT_LIMITS, ContactComponent } from './contact.component';
import { HttpService } from '../http.service';
import { RESTAURANT_INFO } from '../restaurant-info';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let httpService: jasmine.SpyObj<HttpService>;

  const validInquiry = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    subject: 'Table booking for six',
    message: 'Can we book a table for six on Friday evening?',
  };

  beforeEach(() => {
    httpService = jasmine.createSpyObj<HttpService>('HttpService', [
      'ContactForm',
    ]);
    TestBed.configureTestingModule({
      declarations: [ContactComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: HttpService, useValue: httpService }],
    });
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('accepts a subject that contains spaces', () => {
    component.subject.setValue('Table booking for six');
    expect(component.subject.valid).toBeTrue();
  });

  it('accepts a long message up to the limit', () => {
    component.message.setValue('a'.repeat(500));
    expect(component.message.valid).toBeTrue();
    component.message.setValue('a'.repeat(CONTACT_LIMITS.message.max));
    expect(component.message.valid).toBeTrue();
  });

  it('rejects a message over the limit', () => {
    component.message.setValue('a'.repeat(CONTACT_LIMITS.message.max + 1));
    expect(component.message.hasError('maxlength')).toBeTrue();
  });

  it('does not send an invalid form and shows every error', () => {
    component.submit();
    fixture.detectChanges();

    expect(httpService.ContactForm).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('.field-error').length).toBe(4);
  });

  it('sends a valid inquiry', () => {
    component.contactForm.setValue(validInquiry);
    component.submit();

    expect(httpService.ContactForm).toHaveBeenCalledOnceWith(validInquiry);
  });

  it('shows the shared contact details', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain(RESTAURANT_INFO.phone);
    expect(text).toContain(RESTAURANT_INFO.openDays);
  });
});
