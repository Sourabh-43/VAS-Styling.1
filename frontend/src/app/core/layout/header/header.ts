import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

import { Subject } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {

  searchQuery = '';
  suggestions: Product[] = [];

  private searchSubject = new Subject<string>();

  constructor(
    public cart: CartService,
    public auth: AuthService,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.productService.searchProducts(query))
    ).subscribe({

      next: (products) => {
        this.suggestions = products.slice(0, 5);
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Search error:', err);
        this.suggestions = [];
        this.cdr.detectChanges();
      }

    });

  }

  onSearch(event: Event) {

    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;

    if (this.searchQuery.length < 2) {
      this.suggestions = [];
      return;
    }

    this.searchSubject.next(this.searchQuery);
  }

  goToProduct(product: Product) {

    this.searchQuery = '';
    this.suggestions = [];

    this.router.navigate(['/product', product._id]);
  }

  trackProduct(index: number, product: Product): string | number {
    return product._id ?? index;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}