// src/app/features/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartDetailsResponse, UpdateCartQuantityRequest } from '../../shared/models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-container">
      <h1>Shopping Cart</h1>

      <!-- Loading State -->
      <div class="loading" *ngIf="isLoading">
        <p>Loading cart...</p>
      </div>

      <!-- Cart Content -->
      <div class="cart-content" *ngIf="!isLoading && cartItems.length > 0">
        <!-- Active Items Section -->
        <section class="cart-section" *ngIf="activeItems.length > 0">
          <h2>Items in Cart ({{ activeItems.length }})</h2>
          <div class="cart-items">
            <div class="cart-item" *ngFor="let item of activeItems">
              <div class="item-image">📦</div>
              <div class="item-details">
                <h3>{{ item.name }}</h3>
                <p class="item-price">₹{{ item.price | number: '1.0-0' }}</p>
              </div>
              <div class="item-quantity">
                <button
                  (click)="onQuantityChange(item, -1)"
                  [disabled]="item.quantity <= 1"
                >
                  -
                </button>
                <input type="number" [value]="item.quantity" disabled />
                <button (click)="onQuantityChange(item, 1)">+</button>
              </div>
              <div class="item-subtotal">
                <p>₹{{ item.price * item.quantity | number: '1.0-0' }}</p>
              </div>
              <div class="item-actions">
                <button
                  class="btn-save-later"
                  (click)="onSaveForLater(item)"
                  title="Save for later"
                >
                  💾
                </button>
                <button
                  class="btn-remove"
                  (click)="onRemoveItem(item.productId)"
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Save for Later Section -->
        <section class="cart-section" *ngIf="savedForLaterItems.length > 0">
          <h2>Saved for Later ({{ savedForLaterItems.length }})</h2>
          <div class="cart-items">
            <div class="cart-item saved" *ngFor="let item of savedForLaterItems">
              <div class="item-image">📦</div>
              <div class="item-details">
                <h3>{{ item.name }}</h3>
                <p class="item-price">₹{{ item.price | number: '1.0-0' }}</p>
              </div>
              <div class="item-quantity">
                <input type="number" [value]="item.quantity" disabled />
              </div>
              <div class="item-subtotal">
                <p>₹{{ item.price * item.quantity | number: '1.0-0' }}</p>
              </div>
              <div class="item-actions">
                <button
                  class="btn-move-cart"
                  (click)="onMoveToCart(item)"
                  title="Move to cart"
                >
                  🔄
                </button>
                <button
                  class="btn-remove"
                  (click)="onRemoveItem(item.productId)"
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Cart Summary -->
        <aside class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-item">
            <span>Subtotal:</span>
            <span>₹{{ subtotal | number: '1.0-0' }}</span>
          </div>
          <div class="summary-item">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div class="summary-item">
            <span>Tax:</span>
            <span>₹{{ tax | number: '1.0-0' }}</span>
          </div>
          <div class="summary-total">
            <span>Total:</span>
            <span>₹{{ total | number: '1.0-0' }}</span>
          </div>
          <button class="btn-checkout" [disabled]="activeItems.length === 0">
            Proceed to Checkout
          </button>
        </aside>
      </div>

      <!-- Empty Cart State -->
      <div class="empty-cart" *ngIf="!isLoading && cartItems.length === 0">
        <p>🛒 Your cart is empty</p>
        <a routerLink="/shop/tshirt" class="btn-continue-shopping">
          Continue Shopping
        </a>
      </div>

      <!-- Error Message -->
      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [
    `
      .cart-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        font-size: 32px;
        margin-bottom: 30px;
        color: #333;
      }

      .loading {
        text-align: center;
        padding: 40px;
        color: #667eea;
        font-size: 16px;
      }

      .cart-content {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 30px;
      }

      .cart-section {
        background: white;
        padding: 25px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
      }

      .cart-section h2 {
        font-size: 20px;
        margin-bottom: 20px;
        color: #333;
        border-bottom: 2px solid #667eea;
        padding-bottom: 10px;
      }

      .cart-items {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .cart-item {
        display: grid;
        grid-template-columns: 80px 1fr 120px 120px 100px;
        gap: 20px;
        align-items: center;
        padding: 15px;
        border: 1px solid #f0f0f0;
        border-radius: 6px;
        background: #fafafa;
        transition: background 0.3s;
      }

      .cart-item:hover {
        background: white;
      }

      .cart-item.saved {
        opacity: 0.7;
      }

      .item-image {
        font-size: 40px;
        text-align: center;
      }

      .item-details h3 {
        font-size: 14px;
        margin: 0 0 5px 0;
        color: #333;
      }

      .item-price {
        font-size: 16px;
        font-weight: bold;
        color: #667eea;
        margin: 0;
      }

      .item-quantity {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .item-quantity button {
        background: white;
        border: 1px solid #ddd;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.3s;
      }

      .item-quantity button:hover:not(:disabled) {
        background: #667eea;
        color: white;
      }

      .item-quantity button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .item-quantity input {
        width: 40px;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 5px;
      }

      .item-subtotal {
        text-align: right;
        font-weight: bold;
        color: #333;
      }

      .item-subtotal p {
        margin: 0;
        font-size: 16px;
      }

      .item-actions {
        display: flex;
        gap: 8px;
      }

      .item-actions button {
        background: white;
        border: 1px solid #ddd;
        width: 36px;
        height: 36px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background 0.3s;
      }

      .item-actions button:hover {
        background: #f0f0f0;
      }

      .btn-remove:hover {
        background: #ffe6e6;
      }

      /* Cart Summary */
      .cart-summary {
        background: white;
        padding: 25px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        height: fit-content;
        position: sticky;
        top: 20px;
      }

      .cart-summary h2 {
        font-size: 20px;
        margin-bottom: 20px;
        color: #333;
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 14px;
        color: #666;
      }

      .summary-total {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 2px solid #f0f0f0;
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }

      .btn-checkout {
        width: 100%;
        margin-top: 20px;
        padding: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 5px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.3s;
      }

      .btn-checkout:hover:not(:disabled) {
        opacity: 0.9;
      }

      .btn-checkout:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Empty Cart */
      .empty-cart {
        text-align: center;
        padding: 80px 20px;
        background: #f9f9f9;
        border-radius: 8px;
      }

      .empty-cart p {
        font-size: 24px;
        color: #999;
        margin-bottom: 20px;
      }

      .btn-continue-shopping {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 40px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: 600;
        transition: opacity 0.3s;
      }

      .btn-continue-shopping:hover {
        opacity: 0.9;
      }

      /* Error Message */
      .error-message {
        background: #ffe6e6;
        color: #c0392b;
        padding: 15px;
        border-radius: 5px;
        border-left: 4px solid #c0392b;
        margin-top: 20px;
      }

      @media (max-width: 768px) {
        .cart-content {
          grid-template-columns: 1fr;
        }

        .cart-item {
          grid-template-columns: 60px 1fr;
          gap: 10px;
        }

        .item-quantity,
        .item-subtotal,
        .item-actions {
          grid-column: 2;
        }

        .cart-summary {
          position: static;
        }
      }
    `,
  ],
})
export class CartComponent implements OnInit {
  cartItems: CartDetailsResponse[] = [];
  activeItems: CartDetailsResponse[] = [];
  savedForLaterItems: CartDetailsResponse[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cartService.getCartDetails().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.activeItems = items.filter((i) => !i.saveForLater);
        this.savedForLaterItems = items.filter((i) => i.saveForLater);
        this.isLoading = false;
        this.cartService.getCart().subscribe();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load cart. Please try again.';
        console.error('Error loading cart:', error);
      },
    });
  }

  get subtotal(): number {
    return this.activeItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  get tax(): number {
    return Math.round(this.subtotal * 0.05); // 5% tax
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  onQuantityChange(item: CartDetailsResponse, delta: number): void {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    const request: UpdateCartQuantityRequest = { quantity: newQuantity };
    this.cartService.updateQuantity(item.productId, request).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity');
      },
    });
  }

  onSaveForLater(item: CartDetailsResponse): void {
    this.cartService.saveForLater(item.productId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Error saving for later:', error);
        alert('Failed to save item');
      },
    });
  }

  onMoveToCart(item: CartDetailsResponse): void {
    this.cartService.moveToCart(item.productId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Error moving to cart:', error);
        alert('Failed to move item');
      },
    });
  }

  onRemoveItem(productId: string): void {
    if (confirm('Are you sure you want to remove this item?')) {
      this.cartService.removeFromCart(productId).subscribe({
        next: () => {
          this.loadCart();
        },
        error: (error) => {
          console.error('Error removing item:', error);
          alert('Failed to remove item');
        },
      });
    }
  }
}