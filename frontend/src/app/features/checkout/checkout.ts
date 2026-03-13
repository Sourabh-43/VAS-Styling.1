import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss'] // ✅ REQUIRED
})
export class CheckoutComponent {

  // form fields
  name = '';
  address = '';
  phone = '';

  constructor(
    public cart: CartService,
    private orders: OrderService,
    private router: Router
  ) {}

  placeOrder() {
    this.orders.placeOrder(this.cart.items(), this.cart.total());
    this.cart.clear();
    this.router.navigate(['/orders-success']);
  }
}
