import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'] ,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class LoginComponent {


  email = '';
  password = '';

  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

 login(): void {
  if (!this.email || !this.password) {
    this.error = 'Email and password are required';
    return;
  }

  this.loading = true;
  this.error = '';

  this.auth.login(this.email, this.password).subscribe({
    next: () => {
      this.loading = false;

      // 🔐 ROLE-BASED REDIRECT (IMPORTANT)
      if (this.auth.isAdmin()) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    },
    error: (err) => {
      this.error = err.error?.message || 'Login failed';
      this.loading = false;
    }
  });
}

}
