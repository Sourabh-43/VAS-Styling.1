import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';

@Injectable({ providedIn: 'root' })
export class CartService {

  /* =========================
     STATE
  ========================= */

  private _items = signal<CartItem[]>(this.loadCart());

  // 🔥 Toast message
  private _message = new BehaviorSubject<string | null>(null);
  message$ = this._message.asObservable();

  /* =========================
     READ
  ========================= */

  items = computed(() => this._items());

  count = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  /* =========================
     ACTIONS
  ========================= */

  add(product: Product, size?: string) {

    let isNewItem = false;

    this._items.update(items => {

      const existing = items.find(
        i => i._id === product._id && i.size === size
      );

      if (existing) {
        return items.map(i =>
          i._id === product._id && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      isNewItem = true;

      const newItem: CartItem = {
        _id: product._id!,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        quantity: 1
      };

      return [...items, newItem];
    });

    // ✅ Clean messaging
    if (isNewItem) {
      this.showMessage(`${product.name} added to cart`);
    } else {
      this.showMessage(`Increased quantity of ${product.name}`);
    }

    this.saveCart();
  }

  increase(item: CartItem) {

    this._items.update(items =>
      items.map(i =>
        i._id === item._id && i.size === item.size
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );

    this.showMessage(`Increased ${item.name}`);
    this.saveCart();
  }

  decrease(item: CartItem) {

    this._items.update(items =>
      items
        .map(i =>
          i._id === item._id && i.size === item.size
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter(i => i.quantity > 0)
    );

    this.showMessage(`Decreased ${item.name}`);
    this.saveCart();
  }

  remove(item: CartItem) {

    this._items.update(items =>
      items.filter(
        i => !(i._id === item._id && i.size === item.size)
      )
    );

    this.showMessage(`${item.name} removed from cart`);
    this.saveCart();
  }

  clear() {

    this._items.set([]);
    localStorage.removeItem(this.getCartKey());

    this.showMessage('Cart cleared');
  }

  /* =========================
     TOAST
  ========================= */

  private showMessage(msg: string) {
    this._message.next(msg);
    setTimeout(() => this._message.next(null), 2000);
  }

  /* =========================
     STORAGE
  ========================= */

  private saveCart() {
    localStorage.setItem(
      this.getCartKey(),
      JSON.stringify(this._items())
    );
  }

  private loadCart(): CartItem[] {
    const data = localStorage.getItem(this.getCartKey());

    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  /* =========================
     USER BASED CART
  ========================= */

  private getCartKey(): string {

    const user = JSON.parse(localStorage.getItem('user') || 'null');

    return user?.email
      ? `cart_${user.email}`
      : 'cart_guest';
  }

}