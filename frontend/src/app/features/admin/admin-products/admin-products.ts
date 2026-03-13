import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrls: ['./admin-products.scss']
})
export class AdminProductsComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  searchTerm = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.loading = false;
      }
    });
  }

  filterProducts(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }

  deleteProduct(id?: string): void {
    if (!id) return;

    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p._id !== id);
        this.filteredProducts = this.filteredProducts.filter(p => p._id !== id);
      },
      error: (err) => console.error('Delete failed', err)
    });
  }
}