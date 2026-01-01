// src/app/features/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Product, AddToCartRequest } from '../../shared/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Welcome to EStore</h1>
          <p>Discover trending products at amazing prices</p>
          <a routerLink="/shop/tshirt" class="btn-primary">Shop Now</a>
        </div>
      </section>

      <!-- Trending Products Section -->
      <section class="products-section">
        <h2>🔥 Trending Products</h2>
        
        <!-- Loading State -->
        <div class="loading" *ngIf="isLoading">
          <p>Loading trending products...</p>
        </div>

        <!-- Error State -->
        <div class="error" *ngIf="errorMessage">
          <p>{{ errorMessage }}</p>
        </div>

        <!-- Products Grid -->
        <div class="products-grid" *ngIf="!isLoading && products.length > 0">
          <div class="product-card" *ngFor="let product of products">
            <div class="product-image">
              <span class="trending-badge">Trending</span>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-meta">
                <span class="category">{{ product.type }}</span>
                <span class="color">{{ product.color }}</span>
              </p>
              <p class="product-price">₹{{ product.price | number: '1.0-0' }}</p>
            </div>
            <button
              class="btn-add-to-cart"
              (click)="onAddToCart(product)"
              [disabled]="product.id === addingToCartProductId"
            >
              {{
                addingToCartProductId === product.id
                  ? 'Adding...'
                  : 'Add to Cart'
              }}
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!isLoading && products.length === 0">
          <p>No trending products available at the moment.</p>
        </div>
      </section>

      <!-- Categories Preview Section -->
      <section class="categories-section">
        <h2>Shop by Category</h2>
        <div class="categories-grid">
          <a routerLink="/shop/tshirt" class="category-card">
            <span>👕</span>
            <p>T-Shirts</p>
          </a>
          <a routerLink="/shop/shoes" class="category-card">
            <span>👟</span>
            <p>Shoes</p>
          </a>
          <a routerLink="/shop/jeans" class="category-card">
            <span>👖</span>
            <p>Jeans</p>
          </a>
          <a routerLink="/shop/accessories" class="category-card">
            <span>⌚</span>
            <p>Accessories</p>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home-container {
        width: 100%;
      }

      /* Hero Section */
      .hero {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 80px 20px;
        text-align: center;
        border-radius: 10px;
        margin-bottom: 60px;
      }

      .hero-content h1 {
        font-size: 48px;
        margin-bottom: 20px;
        font-weight: bold;
      }

      .hero-content p {
        font-size: 20px;
        margin-bottom: 30px;
        opacity: 0.9;
      }

      .btn-primary {
        display: inline-block;
        background: white;
        color: #667eea;
        padding: 12px 40px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: 600;
        transition: transform 0.3s, box-shadow 0.3s;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }

      /* Products Section */
      .products-section {
        margin-bottom: 80px;
      }

      .products-section h2 {
        font-size: 32px;
        margin-bottom: 40px;
        color: #333;
      }

      .loading,
      .error {
        text-align: center;
        padding: 40px;
        font-size: 18px;
      }

      .error {
        color: #e74c3c;
        background: #ffe6e6;
        border-radius: 5px;
        border-left: 4px solid #e74c3c;
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 30px;
      }

      .product-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;
        display: flex;
        flex-direction: column;
      }

      .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      }

      .product-image {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        font-size: 48px;
      }

      .trending-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ff6b6b;
        color: white;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
      }

      .product-info {
        flex: 1;
        padding: 20px;
      }

      .product-info h3 {
        font-size: 16px;
        margin: 0 0 10px 0;
        color: #333;
      }

      .product-meta {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
        font-size: 12px;
      }

      .category,
      .color {
        background: #f0f0f0;
        padding: 4px 8px;
        border-radius: 3px;
        color: #666;
      }

      .product-price {
        font-size: 20px;
        font-weight: bold;
        color: #667eea;
        margin: 0;
      }

      .btn-add-to-cart {
        background: #667eea;
        color: white;
        border: none;
        padding: 12px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.3s;
      }

      .btn-add-to-cart:hover:not(:disabled) {
        background: #5568d3;
      }

      .btn-add-to-cart:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #999;
        font-size: 18px;
      }

      /* Categories Section */
      .categories-section {
        margin-top: 80px;
      }

      .categories-section h2 {
        font-size: 32px;
        margin-bottom: 40px;
        color: #333;
      }

      .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
      }

      .category-card {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        padding: 40px 20px;
        border-radius: 10px;
        text-align: center;
        text-decoration: none;
        color: white;
        transition: transform 0.3s, box-shadow 0.3s;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .category-card:nth-child(2) {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      .category-card:nth-child(3) {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }

      .category-card:nth-child(4) {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }

      .category-card span {
        font-size: 48px;
        margin-bottom: 10px;
      }

      .category-card p {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
      }

      .category-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      }

      @media (max-width: 768px) {
        .hero-content h1 {
          font-size: 32px;
        }

        .hero-content p {
          font-size: 16px;
        }

        .products-section h2,
        .categories-section h2 {
          font-size: 24px;
        }

        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  errorMessage = '';
  addingToCartProductId: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrendingProducts();
  }

  private loadTrendingProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getTrending().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load trending products. Please try again later.';
        console.error('Error loading trending products:', error);
      },
    });
  }

  onAddToCart(product: Product): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.addingToCartProductId = product.id;

    const addToCartRequest: AddToCartRequest = {
      productId: product.id,
      quantity: 1,
    };

    this.cartService.addToCart(addToCartRequest).subscribe({
      next: () => {
        this.addingToCartProductId = null;
        // Reload cart to update count
        this.cartService.getCart().subscribe();
        alert('Product added to cart!');
      },
      error: (error) => {
        this.addingToCartProductId = null;
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart');
      },
    });
  }
}