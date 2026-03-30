import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product';

import { Subject, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.html',
  styleUrls: ['./product.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  product?: Product;

  loading = true;
  error = false;

  selectedSize: string | null = null;
  showSizeError = false;

  private destroy$ = new Subject<void>();

  private BASE_URL = 'https://vas-styling-backend.onrender.com';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cart: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {

        const id = params.get('id');

        if (!id) {
          this.error = true;
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.loading = true;
        this.error = false;
        this.cdr.detectChanges();

        this.productService.getById(id)
          .pipe(
            finalize(() => {
              this.loading = false;
              this.cdr.detectChanges();
            }),
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: (data: Product) => {

               this.product = {
    ...data,
    image: this.getImageUrl(data.image),
    hoverImage: this.getImageUrl(
      (data as any).hoverImage || data.image
    )
  };

              this.selectedSize = null;
              this.showSizeError = false;

              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('product request error', err);

              this.error = true;
              this.loading = false;

              this.cdr.detectChanges();
            }
          });

      });

  }

  /* =========================
     IMAGE URL FIX
  ========================= */

 private getImageUrl(image?: string) {

  if (!image) return 'assets/placeholder.png';

  // Already full URL
  if (image.startsWith('http')) {
    return image;
  }

  // Upload folder path
  if (image.startsWith('/uploads')) {
    return this.BASE_URL + image;
  }

  // If just filename
  return this.BASE_URL + '/uploads/' + image;
}
  /* =========================
     SIZE SELECT
  ========================= */

  selectSize(size: string) {
    this.selectedSize = size;
    this.showSizeError = false;
  }

  /* =========================
     ADD TO CART
  ========================= */

  addToCart(event: MouseEvent) {

    if (!this.selectedSize || !this.product) {
      this.showSizeError = true;
      this.cdr.detectChanges();
      return;
    }

    this.animateToCart();
    this.cart.add(this.product, this.selectedSize);
  }

  /* =========================
     ANIMATION
  ========================= */

  private animateToCart() {

    const img = document.querySelector('.product-image') as HTMLImageElement;
    const cart = document.getElementById('cartIcon');

    if (!img || !cart) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();

    const clone = img.cloneNode(true) as HTMLElement;

    clone.style.position = 'fixed';
    clone.style.top = imgRect.top + 'px';
    clone.style.left = imgRect.left + 'px';
    clone.style.width = imgRect.width + 'px';
    clone.style.height = imgRect.height + 'px';

    clone.style.borderRadius = '12px';
    clone.style.transition = 'all 0.7s cubic-bezier(.4,-0.3,1,.68)';
    clone.style.zIndex = '9999';

    document.body.appendChild(clone);

    setTimeout(() => {
      clone.style.top = cartRect.top + 'px';
      clone.style.left = cartRect.left + 'px';
      clone.style.width = '30px';
      clone.style.height = '30px';
      clone.style.opacity = '0.5';
    }, 10);

    setTimeout(() => clone.remove(), 700);
  }

  /* =========================
     IMAGE FALLBACK
  ========================= */

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/placeholder.png';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}