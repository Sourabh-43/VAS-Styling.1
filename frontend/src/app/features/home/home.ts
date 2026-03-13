import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule,
     RouterModule,
    ProductCardComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {

  allProducts: Product[] = [];
  loading: boolean = true;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 6;

  constructor(
    public auth: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  // Total number of pages
  get totalPages(): number {
    return Math.ceil(this.allProducts.length / this.pageSize);
  }

  // Products for current page
  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.allProducts.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToShop() {
    this.router.navigate(['/shop']);  // ✅ Reliable navigation
  }


  addToCart(product: Product): void {
    console.log('Added to cart:', product);
  }
}