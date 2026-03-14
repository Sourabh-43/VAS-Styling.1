import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.html',
  styleUrls: ['./product.scss']
})
export class ProductComponent implements OnInit {

  product?: Product;

  loading = true;
  error = false;

  selectedSize: string | null = null;
  showSizeError = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cart: CartService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const id = params.get('id');

      if (!id) {
        this.error = true;
        this.loading = false;
        this.cd.detectChanges();
        return;
      }

      this.loading = true;
      this.error = false;

      this.productService.getById(id)
        .pipe(
          finalize(() => {
            console.log('product request finished');
            this.loading = false;
            this.cd.detectChanges();
          })
        )
        .subscribe({
          next: (data: Product) => {
            console.log('received product', data);

            this.product = data;

            /* reset UI state when product changes */

            this.selectedSize = null;
            this.showSizeError = false;

            this.cd.detectChanges();
          },
          error: (err) => {
            console.error('product request error', err);
            this.error = true;
            this.loading = false;
            this.cd.detectChanges();
          }
        });

    });

  }

  selectSize(size: string) {
    this.selectedSize = size;
    this.showSizeError = false;
  }

  addToCart() {

    if (!this.selectedSize || !this.product) {
      this.showSizeError = true;
      return;
    }

    this.cart.add(this.product, this.selectedSize);

  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/placeholder.png';
  }

}