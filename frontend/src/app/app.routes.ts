import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [

  /* ================= PUBLIC ================= */

  {
    path: '',
    loadComponent: () =>
      import('./features/home/home').then(m => m.Home)
  },

  /* SHOP ROUTES */

  {
    path: 'shop',
    children: [

      {
        path: '',
        loadComponent: () =>
          import('./features/shop/shop').then(m => m.ShopComponent)
      },

      {
        path: ':gender',
        loadComponent: () =>
          import('./features/shop/shop').then(m => m.ShopComponent)
      },

      {
        path: ':gender/:category',
        loadComponent: () =>
          import('./features/shop/shop').then(m => m.ShopComponent)
      }

    ]
  },

  /* PRODUCT PAGE */

  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product/product')
        .then(m => m.ProductComponent)
  },

  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart')
        .then(m => m.CartComponent)
  },

  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/checkout')
        .then(m => m.CheckoutComponent)
  },

  {
    path: 'orders-success',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders-success/orders-success')
        .then(m => m.OrdersSuccessComponent)
  },

  /* ================= AUTH ================= */

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.RegisterComponent)
  },

  /* ================= ADMIN ================= */

  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/admin-layout/admin-layout')
        .then(m => m.AdminLayoutComponent),

    children: [

      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/admin-products/admin-products')
            .then(m => m.AdminProductsComponent)
      },

      {
        path: 'products/new',
        loadComponent: () =>
          import('./features/admin/admin-product-form/admin-product-form')
            .then(m => m.AdminProductFormComponent)
      },

      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./features/admin/admin-product-form/admin-product-form')
            .then(m => m.AdminProductFormComponent)
      },

      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/admin-orders/admin-orders')
            .then(m => m.AdminOrdersComponent)
      }

    ]
  },

  /* ================= FALLBACK ================= */

  {
    path: '**',
    redirectTo: ''
  }

];