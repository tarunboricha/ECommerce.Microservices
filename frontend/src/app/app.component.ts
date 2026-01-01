// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { User } from './shared/models/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Logo -->
        <div class="logo">
          <a routerLink="/">🛍️ EStore</a>
        </div>

        <!-- Navigation Links -->
        <ul class="nav-links">
          <li>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          </li>
          <li>
            <a routerLink="/shop/tshirt" routerLinkActive="active">Shop</a>
          </li>

          <!-- Admin Link (Only for ADMIN users) -->
          <li *ngIf="(currentUser$ | async)?.role === 'ADMIN'">
            <a routerLink="/admin" routerLinkActive="active">Admin</a>
          </li>

          <!-- Auth Links -->
          <li *ngIf="!(isLoggedIn$ | async); else logoutLink">
            <a routerLink="/auth/login" routerLinkActive="active">Login</a>
          </li>

          <!-- Cart Icon with Count -->
          <li *ngIf="isLoggedIn$ | async" class="cart-link">
            <a routerLink="/cart">
              🛒 Cart
              <span class="cart-count" *ngIf="(cartCount$ | async) as count">
                {{ count }}
              </span>
            </a>
          </li>

          <!-- Logout Button -->
          <ng-template #logoutLink>
            <li>
              <span class="user-email">{{ (currentUser$ | async)?.email }}</span>
              <button class="btn-logout" (click)="onLogout()">Logout</button>
            </li>
          </ng-template>
        </ul>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2025 E-Commerce Platform. All rights reserved.</p>
    </footer>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .navbar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .navbar-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 70px;
      }

      .logo a {
        font-size: 24px;
        font-weight: bold;
        color: white;
        text-decoration: none;
        display: flex;
        align-items: center;
      }

      .logo a:hover {
        text-decoration: none;
      }

      .nav-links {
        list-style: none;
        display: flex;
        align-items: center;
        gap: 30px;
        margin: 0;
        padding: 0;
      }

      .nav-links a {
        color: white;
        text-decoration: none;
        font-weight: 500;
        font-size: 14px;
        transition: opacity 0.3s;
        position: relative;
      }

      .nav-links a:hover {
        opacity: 0.8;
      }

      .nav-links a.active {
        border-bottom: 2px solid white;
        padding-bottom: 5px;
      }

      .cart-link {
        position: relative;
      }

      .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ff6b6b;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
      }

      .user-email {
        color: white;
        font-size: 13px;
      }

      .btn-logout {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid white;
        padding: 6px 15px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-size: 12px;
        transition: background 0.3s;
      }

      .btn-logout:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .main-content {
        flex: 1;
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        padding: 40px 20px;
      }

      .footer {
        background: #f5f5f5;
        padding: 20px;
        text-align: center;
        color: #666;
        border-top: 1px solid #ddd;
        margin-top: 40px;
      }

      @media (max-width: 768px) {
        .navbar-container {
          flex-wrap: wrap;
          height: auto;
          padding: 10px 20px;
        }

        .nav-links {
          gap: 15px;
          flex-wrap: wrap;
          width: 100%;
          justify-content: center;
          margin-top: 10px;
        }

        .logo {
          width: 100%;
          text-align: center;
          margin-bottom: 10px;
        }
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  currentUser$: Observable<User | null>;
  isLoggedIn$: Observable<boolean>;
  cartCount$: Observable<number>;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.cartCount$ = this.cartService.cartCount$;
    this.isLoggedIn$ = new Observable((observer) => {
      observer.next(this.authService.isLoggedIn());
      this.authService.currentUser$.subscribe(() => {
        observer.next(this.authService.isLoggedIn());
      });
    });
  }

  ngOnInit(): void {
    // Load cart count if user is logged in
    if (this.authService.isLoggedIn()) {
      this.cartService.getCart().subscribe();
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
