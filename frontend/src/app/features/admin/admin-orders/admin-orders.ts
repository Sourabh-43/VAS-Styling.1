import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Signal } from '@angular/core';
import { Order } from '../../../core/models/order';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.html',
  styleUrls: ['./admin-orders.scss']
})
export class AdminOrdersComponent  implements OnInit {

  orders!: Signal<Order[]>;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orders = this.orderService.orders;
  }

  changeStatus(orderId: string, status: 'pending' | 'paid' | 'shipped') {
    this.orderService.updateStatus(orderId, status);
  }
}
