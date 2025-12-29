// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { MenuComponent } from './menu.component';

// describe('MenuComponent', () => {
//   let component: MenuComponent;
//   let fixture: ComponentFixture<MenuComponent>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       declarations: [MenuComponent],
//     });
//     fixture = TestBed.createComponent(MenuComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
//import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      //    providers: [ActivatedRoute],
      declarations: [MenuComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
  });

  describe('Cart Display', () => {
    it('should display cart items when GettotalPrice observable emits', () => {
      const mockCartItems = [
        { id: 1, name: 'Pizza', price: 10.99 },
        { id: 2, name: 'Burger', price: 8.99 },
      ];
      const mockTotal = { subTotal: 19.98, taxAmount: 1.6, total: 21.58 };

      component.DisplayCartItems = of(mockCartItems);
      component.GettotalPrice = of(mockTotal);
      fixture.detectChanges();

      const listItems =
        fixture.nativeElement.querySelectorAll('.list-group-item');
      expect(listItems.length).toBeGreaterThan(0);
    });
  });
});
