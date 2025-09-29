import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-cart-count',
    templateUrl: './cart-count.component.html',
    styleUrls: ['./cart-count.component.css'],
    standalone: false
})
export class CartCountComponent {
  @Input() cartSize: number = 10;
}
