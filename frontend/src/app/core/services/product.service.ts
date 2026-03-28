import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private API = 'https://vas-styling-backend.onrender.com/api';

  constructor(private http: HttpClient) {}

  /* =========================
     GET ALL PRODUCTS
  ========================= */

  getAll(gender?: string, category?: string): Observable<Product[]> {

    const params: any = {};

    if (gender) params.gender = gender;
    if (category) params.category = category;

    return this.http.get<Product[]>(
      `${this.API}/products`,
      { params }
    );
  }

  /* =========================
     GET PRODUCT BY ID
  ========================= */

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(
      `${this.API}/products/${id}`
    );
  }

  /* =========================
     CREATE PRODUCT (ADMIN)
  ========================= */

  create(formData: FormData): Observable<Product> {
    return this.http.post<Product>(
      `${this.API}/admin/products`,
      formData
    );
  }

  /* =========================
     UPDATE PRODUCT (ADMIN)
  ========================= */

  update(id: string, formData: FormData): Observable<Product> {
    return this.http.put<Product>(
      `${this.API}/admin/products/${id}`,
      formData
    );
  }

  /* =========================
     DELETE PRODUCT (ADMIN)
  ========================= */

  delete(id: string): Observable<any> {
    return this.http.delete(
      `${this.API}/admin/products/${id}`
    );
  }

  /* =========================
     SEARCH PRODUCTS
  ========================= */

  searchProducts(query: string): Observable<Product[]> {

    if (!query || query.trim().length === 0) {
      return this.getAll();
    }

    return this.http.get<Product[]>(
      `${this.API}/products/search`,
      {
        params: { q: query }
      }
    );
  }

}