import {
  Component,
  OnInit,
  OnDestroy,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

import { Subject, takeUntil } from 'rxjs';
import {
  debounceTime,
  switchMap,
  distinctUntilChanged
} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  /* =========================
     SEARCH
  ========================= */
  searchQuery = '';
  suggestions: Product[] = [];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  /* =========================
     UI STATE
  ========================= */
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  constructor(
    public cart: CartService,
    public auth: AuthService,
    private router: Router,
    private productService: ProductService
  ) {}

  /* =========================
     INIT
  ========================= */

  ngOnInit() {

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query =>
        this.productService.searchProducts(query)
      ),
      takeUntil(this.destroy$)
    ).subscribe({

      next: (products) => {
        this.suggestions = products.slice(0, 5);
      },

      error: (err) => {
        console.error('Search error:', err);
        this.suggestions = [];
      }

    });

    // 🔥 Cart bump animation trigger
    this.cart.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.bumpCart());

  }

  /* =========================
     SEARCH
  ========================= */

  onSearch(event: Event) {

    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;

    if (this.searchQuery.length < 2) {
      this.suggestions = [];
      return;
    }

    this.searchSubject.next(this.searchQuery);
  }
  onImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/no-image.png';
}

  goToProduct(product: Product) {

    this.searchQuery = '';
    this.suggestions = [];

    this.router.navigate(['/product', product._id]);
  }

  trackProduct(index: number, product: Product): string | number {
    return product._id ?? index;
  }

  /* =========================
     DROPDOWN 👤
  ========================= */

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  /* =========================
     MOBILE MENU 🍔
  ========================= */

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // prevent background scroll when menu open
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : 'auto';
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  /* =========================
     CLICK OUTSIDE (PRO UX)
  ========================= */

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    // close dropdown if clicked outside
    if (!target.closest('.user-menu')) {
      this.isDropdownOpen = false;
    }

    // close mobile menu if clicking overlay area
    if (this.isMobileMenuOpen && target.classList.contains('overlay')) {
      this.closeMobileMenu();
    }
  }

  /* =========================
     CART ANIMATION 🛒
  ========================= */

  private bumpCart() {

    const cartEl = document.getElementById('cartIcon');
    if (!cartEl) return;

    cartEl.classList.remove('bump');
    void cartEl.offsetWidth; // reflow trick
    cartEl.classList.add('bump');
  }

  /* =========================
     AUTH
  ========================= */

  logout() {
    this.auth.logout();
    this.closeDropdown();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }

  /* =========================
     CLEANUP
  ========================= */

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    // reset scroll just in case
    document.body.style.overflow = 'auto';
  }

}