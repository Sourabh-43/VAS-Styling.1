import { 
  Component, 
  OnInit, 
  ChangeDetectorRef 
} from '@angular/core';

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

  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  hoverFile?: File;
  hoverPreview?: string;

  loading = false;

  availableSizes = ['XS','S','M','L','XL','XXL','28','30','32','34','36'];

  product: Product = {
    name: '',
    slug: '',
    price: 0,
    stock: 0,
    images: [],
    gender: 'men',
    category: 'tshirts',
    sizes: [],
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.isEdit = true;
      this.loading = true;

      this.productService.getAll().subscribe(products => {

        const existing = products.find(p => p._id === id);

        if (existing) {

          this.product = { ...existing };

          // Multiple images
          if (existing.images?.length) {
            this.imagePreviews = existing.images;
          } 
          // Old single image support
          else if (existing.image) {
            this.imagePreviews = [existing.image];
          }

          // Hover image
          if (existing.hoverImage) {
            this.hoverPreview = existing.hoverImage;
          }

        }

        this.loading = false;
        this.cdr.detectChanges();

      });

    }

  }

  toggleSize(size: string) {

    if (this.product.sizes.includes(size)) {
      this.product.sizes =
        this.product.sizes.filter(s => s !== size);
    } else {
      this.product.sizes.push(size);
    }

    this.cdr.detectChanges();

  }

  /* ========================
     MULTIPLE IMAGE SELECT
  ======================== */

  onFileSelected(event: any) {

    const files = event.target.files;

    if (!files) return;

    this.selectedFiles = [];
    this.imagePreviews = [];

    for (let file of files) {

      this.selectedFiles.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
        this.cdr.detectChanges();
      };

      reader.readAsDataURL(file);

    }

  }

  /* ========================
     HOVER IMAGE
  ======================== */

  onHoverSelected(event: any) {

    const file = event.target.files[0];
    if (!file) return;

    this.hoverFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.hoverPreview = reader.result as string;
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);

  }

  /* ========================
     SAVE PRODUCT
  ======================== */

  save(): void {

    const token = localStorage.getItem('token');

    if (!token) {
      alert('Session expired. Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    const formData = new FormData();

    formData.append('name', this.product.name);
    formData.append('slug', this.product.slug);
    formData.append('price', this.product.price.toString());
    formData.append('stock', this.product.stock.toString());
    formData.append('gender', this.product.gender);
    formData.append('category', this.product.category);
    formData.append('description', this.product.description || '');
    formData.append('sizes', JSON.stringify(this.product.sizes));

    // Multiple Images
    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    // Hover Image
    if (this.hoverFile) {
      formData.append('hoverImage', this.hoverFile);
    }

    if (this.isEdit && this.product._id) {

      this.productService.update(this.product._id, formData)
        .subscribe(() => {
          this.loading = false;
          this.router.navigate(['/admin/products']);
        });

    } else {

      this.productService.create(formData)
        .subscribe(() => {
          this.loading = false;
          this.router.navigate(['/admin/products']);
        });

    }

  }

}