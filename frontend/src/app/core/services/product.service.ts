import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private API = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAll(gender?: string, category?: string): Observable<Product[]> {

    const params: any = {};
    if (gender) params.gender = gender;
    if (category) params.category = category;

    return this.http.get<Product[]>(`${this.API}/products`, { params });
  }

 getById(id: string) {
  return this.http.get<Product>(`${this.API}/products/id/${id}`);
}

  create(formData: FormData) {
    return this.http.post(`${this.API}/admin/products`, formData);
  }

  update(id: string, formData: FormData) {
    return this.http.put(`${this.API}/admin/products/${id}`, formData);
  }

  delete(id: string) {
    return this.http.delete(`${this.API}/admin/products/${id}`);
  }
  searchProducts(query: string): Observable<Product[]> {

  if (!query || query.trim().length === 0) {
    return this.getAll();
  }

  return this.http.get<Product[]>(
    `${this.API}/products/search`,
    { params: { q: query } }
  );

}
}