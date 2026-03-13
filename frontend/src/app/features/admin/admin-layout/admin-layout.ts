import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.scss']
})
export class AdminLayoutComponent {

  constructor(private orderService: OrderService) {}

  private orders() {
    return this.orderService.orders();
  }

  ordersCount() {
    return this.orders().length;
  }

  revenue() {
    return this.orders()
      .reduce((sum, o) => sum + o.total, 0);
  }

  pending() {
    return this.orders()
      .filter(o => o.status === 'pending').length;
  }
}