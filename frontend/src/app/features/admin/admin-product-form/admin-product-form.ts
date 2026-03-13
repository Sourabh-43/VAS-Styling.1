import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-product-form.html',
  styleUrls: ['./admin-product-form.scss']
})
export class AdminProductFormComponent implements OnInit {

  isEdit = false;

  selectedFile?: File;
  hoverFile?: File;

  imagePreview?: string;
  hoverPreview?: string;

  availableSizes = ['XS','S','M','L','XL','XXL','28','30','32','34','36'];

  product: Product = {
    name: '',
    slug: '',
    price: 0,
    stock: 0,
    image: '',
    gender: 'men',
    category: 'tshirts',
    sizes: [],
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.isEdit = true;

      this.productService.getAll().subscribe(products => {

        const existing = products.find(p => p._id === id);

        if (existing) {

          this.product = { ...existing };

          if (existing.image) {
            this.imagePreview = 'http://localhost:5000' + existing.image;
          }

          if ((existing as any).hoverImage) {
            this.hoverPreview = 'http://localhost:5000' + (existing as any).hoverImage;
          }

        }

      });

    }

  }

  toggleSize(size: string) {

    if (this.product.sizes.includes(size)) {
      this.product.sizes = this.product.sizes.filter(s => s !== size);
    } else {
      this.product.sizes.push(size);
    }

  }

  onFileSelected(event: any) {

    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);

  }

  onHoverSelected(event: any) {

    const file = event.target.files[0];
    if (!file) return;

    this.hoverFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.hoverPreview = reader.result as string;
    };

    reader.readAsDataURL(file);

  }

  save(): void {

    const formData = new FormData();

    formData.append('name', this.product.name);
    formData.append('slug', this.product.slug);
    formData.append('price', this.product.price.toString());
    formData.append('stock', this.product.stock.toString());
    formData.append('gender', this.product.gender);
    formData.append('category', this.product.category);
    formData.append('description', this.product.description || '');
    formData.append('sizes', JSON.stringify(this.product.sizes));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.hoverFile) {
      formData.append('hoverImage', this.hoverFile);
    }

    if (this.isEdit && this.product._id) {

      this.productService.update(this.product._id, formData)
        .subscribe(() => {
          this.router.navigate(['/admin/products']);
        });

    } else {

      this.productService.create(formData)
        .subscribe(() => {
          this.router.navigate(['/admin/products']);
        });

    }

  }

}