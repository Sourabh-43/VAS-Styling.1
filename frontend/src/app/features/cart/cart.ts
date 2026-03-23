import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {

  constructor(
    public cart: CartService,
    private cdr: ChangeDetectorRef   // ✅ added
  ) {}

  /* =========================
     IMAGE FALLBACK
  ========================= */

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/placeholder.png';

    this.cdr.detectChanges(); // ✅ ensure UI updates
  }

  /* =========================
     TRACK BY
  ========================= */

  trackById(index: number, item: any) {
    return item._id + item.size;
  }

  /* =========================
     OPTIONAL FORCE UPDATE
  ========================= */

  refreshView() {
    this.cdr.detectChanges();
  }

}