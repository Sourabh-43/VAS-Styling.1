import { Injectable, signal, effect } from '@angular/core';
import { Order } from '../models/order';
import { CartItem } from '../models/cart-item';

const STORAGE_KEY = 'vasmart_orders';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private ordersSignal = signal<Order[]>(this.load());

  constructor() {
    effect(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(this.ordersSignal())
      );
    });
  }

  private load(): Order[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  orders = this.ordersSignal.asReadonly();

  placeOrder(cartItems: CartItem[], total: number) {
    const order: Order = {
      id: crypto.randomUUID(),
      items: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.size,
        quantity: item.quantity
      })),
      total,
      status: 'pending',
      createdAt: Date.now()

    };

    this.ordersSignal.update(list => [...list, order]);
  }

  updateStatus(orderId: string, status: Order['status']) {
    this.ordersSignal.update(list =>
      list.map(o =>
        o.id === orderId ? { ...o, status } : o
      )
    );
  }
}
