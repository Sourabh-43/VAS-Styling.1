import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap, finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

@Component({
  standalone: true,
  selector: 'app-shop',
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './shop.html',
  styleUrls: ['./shop.scss']
})
export class ShopComponent implements OnInit {

  products: Product[] = [];
  loading = false;
  errorMessage = '';

  gender: string | null = null;
  category: string | null = null;

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cart: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.route.paramMap
      .pipe(

        takeUntilDestroyed(this.destroyRef),

        switchMap(params => {

          const gender = params.get('gender');
          const category = params.get('category');

          this.gender = gender;
          this.category = category;

          this.loading = true;
          this.errorMessage = '';

          this.cdr.detectChanges(); // update UI immediately

          return this.productService
            .getAll(gender || undefined, category || undefined)
            .pipe(
              finalize(() => {
                this.loading = false;
                this.cdr.detectChanges(); // ensure UI updates
              })
            );

        })

      )
      .subscribe({

        next: (products) => {

          this.products = products;

          this.cdr.detectChanges(); // update product grid

          /* Scroll to products */

          setTimeout(() => {
            const section = document.getElementById('products-section');
            section?.scrollIntoView({ behavior: 'smooth' });
          }, 100);

        },

        error: (err) => {

          console.error('Error loading products:', err);
          this.errorMessage = 'Failed to load products. Please try again.';

          this.cdr.detectChanges();

        }

      });

  }

  addToCart(product: Product) {
    this.cart.add(product);
  }

  trackByProduct(index: number, product: Product) {
    return product._id;
  }

}