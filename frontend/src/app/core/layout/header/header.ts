import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {

  constructor(
    public cart: CartService,
    public auth: AuthService,
    private router: Router
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
