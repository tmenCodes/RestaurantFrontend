import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css'],
    standalone: false
})
export class OrderComponent implements OnInit {
  constructor(private HttpService: HttpService) {}

  orders$: Observable<any> = this.HttpService.GetPastOrders();

  ngOnInit() {}
}
