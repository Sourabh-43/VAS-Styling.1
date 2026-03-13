import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Product } from '../../../core/models/product';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCardComponent {

  @Input() product!: Product;

  @Output() onAddToCart = new EventEmitter<Product>();

  getImageUrl(image: string | null | undefined): string {

    if (!image) {
      return 'assets/placeholder.png';
    }

    if (image.startsWith('http')) {
      return image;
    }

    return 'http://localhost:5000' + image;
  }

  onImageError(event: any) {
    event.target.src = 'assets/placeholder.png';
  }

}