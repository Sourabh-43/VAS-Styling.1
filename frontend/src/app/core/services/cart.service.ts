import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';

@Injectable({ providedIn: 'root' })
export class CartService {

  private _items = signal<CartItem[]>(this.loadCart());

  /* =========================
     READ (USED IN TEMPLATES)
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

    this.saveCart();
  }

  remove(item: CartItem) {

    this._items.update(items =>
      items.filter(
        i => !(i._id === item._id && i.size === item.size)
      )
    );

    this.saveCart();
  }

  clear() {

    this._items.set([]);
    localStorage.removeItem(this.getCartKey());

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

    if (user?.email) {
      return `cart_${user.email}`;
    }

    return 'cart_guest';

  }

}