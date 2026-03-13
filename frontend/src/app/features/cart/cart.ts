import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {

  constructor(public cart: CartService) {}

  /**
   * Fix broken product images
   */
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/placeholder.png';
  }

  /**
   * Improve Angular rendering performance
   */
  trackById(index: number, item: any) {
    return item.id + item.size;
  }

}