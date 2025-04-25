import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCountComponent } from './cart-count.component';

describe('CartCountComponent', () => {
  let component: CartCountComponent;
  let fixture: ComponentFixture<CartCountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartCountComponent]
    });
    fixture = TestBed.createComponent(CartCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
