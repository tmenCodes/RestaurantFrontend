import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefsComponent } from './chefs.component';

describe('ChefsComponent', () => {
  let component: ChefsComponent;
  let fixture: ComponentFixture<ChefsComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChefsComponent],
    });
    fixture = TestBed.createComponent(ChefsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders one card per chef', () => {
    const cards = element.querySelectorAll('.chef-member');
    expect(cards.length).toBe(component.chefs.length);
    expect(cards.length).toBe(3);
  });

  it('shows each chef name and role', () => {
    const names = Array.from(element.querySelectorAll('.member-info h4')).map(
      (h) => h.textContent?.trim()
    );
    expect(names).toEqual(component.chefs.map((chef) => chef.name));
  });

  it('gives every photo descriptive alt text', () => {
    const images = Array.from(element.querySelectorAll('img'));
    expect(images.length).toBe(3);
    images.forEach((img) => expect(img.alt.trim()).not.toBe(''));
  });

  it('has no empty links', () => {
    expect(element.querySelectorAll('a[href=""]').length).toBe(0);
  });
});
