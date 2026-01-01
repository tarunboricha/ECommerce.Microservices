// src/app/features/shop/shop.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import {
  Product,
  CursorQueryParameters,
  AddToCartRequest,
} from '../../shared/models/models';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="shop-container">
      <!-- Sidebar Filters -->
      <aside class="sidebar">
        <h3>Filters</h3>

        <!-- Category Display -->
        <div class="filter-group">
          <h4>Category</h4>
          <p class="category-name">{{ categoryType | uppercase }}</p>
        </div>

        <!-- Price Filter -->
        <div class="filter-group" [formGroup]="filterForm">
          <h4>Price Range</h4>
          <div class="price-inputs">
            <input
              type="number"
              placeholder="Min"
              formControlName="minPrice"
              (change)="onFilterChange()"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              formControlName="maxPrice"
              (change)="onFilterChange()"
            />
          </div>
        </div>

        <!-- Color Filter -->
        <div class="filter-group" [formGroup]="filterForm">
          <h4>Color</h4>
          <select
            formControlName="color"
            (change)="onFilterChange()"
            class="form-control"
          >
            <option value="">All Colors</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="green">Green</option>
          </select>
        </div>

        <!-- Trending Filter -->
        <div class="filter-group" [formGroup]="filterForm">
          <h4>Status</h4>
          <label class="checkbox">
            <input
              type="checkbox"
              formControlName="isTrending"
              (change)="onFilterChange()"
            />
            <span>Trending Only</span>
          </label>
        </div>

        <!-- Reset Button -->
        <button class="btn-reset" (click)="onResetFilters()">
          Reset Filters
        </button>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Header -->
        <div class="content-header">
          <h2>{{ categoryType | uppercase }} Collection</h2>
          <p class="result-count">
            {{ products.length }} products loaded
          </p>
        </div>

        <!-- Loading State -->
        <div class="loading" *ngIf="isLoading && products.length === 0">
          <p>Loading products...</p>
        </div>

        <!-- Products Grid -->
        <div class="products-grid" *ngIf="products.length > 0">
          <div class="product-card" *ngFor="let product of products">
            <div class="product-image">
              <span class="trending-badge" *ngIf="product.isTrending"
                >Trending</span
              >
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
          <p>No products found matching your filters.</p>
          <button class="btn-reset" (click)="onResetFilters()">
            Clear Filters
          </button>
        </div>

        <!-- Infinite Scroll Trigger -->
        <div
          class="scroll-trigger"
          #scrollTrigger
          *ngIf="hasMore && !isLoadingMore && products.length > 0"
        >
          <button class="btn-load-more" (click)="onLoadMore()">
            Load More Products
          </button>
        </div>

        <!-- Loading More State -->
        <div class="loading-more" *ngIf="isLoadingMore">
          <p>Loading more products...</p>
        </div>

        <!-- No More Products -->
        <div class="no-more" *ngIf="!hasMore && products.length > 0">
          <p>✓ All products loaded</p>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .shop-container {
        display: flex;
        gap: 30px;
        min-height: calc(100vh - 200px);
      }

      /* Sidebar */
      .sidebar {
        width: 250px;
        flex-shrink: 0;
      }

      .sidebar h3 {
        font-size: 20px;
        margin-bottom: 20px;
        color: #333;
      }

      .filter-group {
        margin-bottom: 25px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;
      }

      .filter-group h4 {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #333;
        text-transform: uppercase;
      }

      .category-name {
        font-size: 16px;
        font-weight: 600;
        color: #667eea;
        margin: 0;
      }

      .price-inputs {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .price-inputs input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 13px;
      }

      .price-inputs span {
        color: #999;
      }

      .form-control {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 13px;
        font-family: inherit;
      }

      .checkbox {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        font-size: 14px;
      }

      .checkbox input {
        cursor: pointer;
      }

      .btn-reset {
        width: 100%;
        padding: 10px;
        background: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: background 0.3s;
      }

      .btn-reset:hover {
        background: #e0e0e0;
      }

      /* Main Content */
      .main-content {
        flex: 1;
        min-width: 0;
      }

      .content-header {
        margin-bottom: 40px;
        border-bottom: 2px solid #667eea;
        padding-bottom: 20px;
      }

      .content-header h2 {
        font-size: 32px;
        margin: 0 0 10px 0;
        color: #333;
      }

      .result-count {
        color: #999;
        margin: 0;
        font-size: 14px;
      }

      .loading,
      .loading-more {
        text-align: center;
        padding: 40px;
        color: #667eea;
        font-size: 16px;
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 25px;
        margin-bottom: 40px;
      }

      .product-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;
        display: flex;
        flex-direction: column;
      }

      .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }

      .product-image {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        font-size: 40px;
      }

      .trending-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #ff6b6b;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
      }

      .product-info {
        flex: 1;
        padding: 15px;
      }

      .product-info h3 {
        font-size: 14px;
        margin: 0 0 8px 0;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .product-meta {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
        font-size: 11px;
      }

      .category,
      .color {
        background: #f0f0f0;
        padding: 3px 6px;
        border-radius: 3px;
        color: #666;
      }

      .product-price {
        font-size: 16px;
        font-weight: bold;
        color: #667eea;
        margin: 0;
      }

      .btn-add-to-cart {
        background: #667eea;
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
        font-weight: 600;
        font-size: 12px;
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
        background: #f9f9f9;
        border-radius: 8px;
      }

      .empty-state p {
        color: #999;
        font-size: 16px;
        margin-bottom: 20px;
      }

      .scroll-trigger {
        text-align: center;
        padding: 20px;
      }

      .btn-load-more {
        background: #667eea;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.3s;
      }

      .btn-load-more:hover {
        background: #5568d3;
      }

      .no-more {
        text-align: center;
        padding: 20px;
        color: #27ae60;
        font-weight: 600;
      }

      @media (max-width: 768px) {
        .shop-container {
          flex-direction: column;
          gap: 20px;
        }

        .sidebar {
          width: 100%;
          order: 2;
        }

        .main-content {
          order: 1;
        }

        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
        }

        .content-header h2 {
          font-size: 24px;
        }
      }
    `,
  ],
})
export class ShopComponent implements OnInit, OnDestroy {
  categoryType = '';
  filterForm!: FormGroup;
  products: Product[] = [];
  isLoading = false;
  isLoadingMore = false;
  hasMore = true;
  currentCursor: string | null = null;
  addingToCartProductId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.route.params.subscribe((params) => {
      this.categoryType = params['type'] || '';
      this.products = [];
      this.currentCursor = null;
      this.hasMore = true;
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.filterForm = this.formBuilder.group({
      minPrice: [null],
      maxPrice: [null],
      color: [''],
      isTrending: [false],
    });
  }

  private loadProducts(): void {
    this.isLoading = true;

    const filters: CursorQueryParameters = {
      type: this.categoryType,
      color: this.filterForm.get('color')?.value || undefined,
      minPrice: this.filterForm.get('minPrice')?.value || undefined,
      maxPrice: this.filterForm.get('maxPrice')?.value || undefined,
      isTrending: this.filterForm.get('isTrending')?.value || null,
      limit: 1,
      cursor: this.currentCursor || undefined,
    };

    this.productService
      .queryProducts(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (this.currentCursor) {
            // Append to existing products (infinite scroll)
            this.products = [...this.products, ...response.items];
            this.isLoadingMore = false;
          } else {
            // Replace products (new filter)
            this.products = response.items;
            this.isLoading = false;
          }
          this.hasMore = response.hasMore;
          this.currentCursor = response.nextCursor || null;
        },
        error: (error) => {
          this.isLoading = false;
          this.isLoadingMore = false;
          console.error('Error loading products:', error);
        },
      });
  }

  onFilterChange(): void {
    // Reset pagination when filters change
    this.currentCursor = null;
    this.hasMore = true;
    this.loadProducts();
  }

  onResetFilters(): void {
    this.filterForm.reset({
      minPrice: null,
      maxPrice: null,
      color: '',
      isTrending: false,
    });
    this.onFilterChange();
  }

  onLoadMore(): void {
    if (this.hasMore && !this.isLoadingMore) {
      this.isLoadingMore = true;
      this.loadProducts();
    }
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