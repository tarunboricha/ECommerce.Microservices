// src/app/core/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AddToCartRequest,
  CartItem,
  CartDetailsResponse,
  UpdateCartQuantityRequest,
} from '../../shared/models/models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiBaseUrl}/cart`;
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get cart items
   */
  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}`).pipe(
      tap((items) => {
        console.log('Cart Items:', items);
        // Update cart count (count only non-saved items)
        const count = items.filter((i) => !i.saveForLater).length;
        this.cartCountSubject.next(count);
      })
    );
  }

  /**
   * Get cart details (aggregated with product info from gateway)
   */
  getCartDetails(): Observable<CartDetailsResponse[]> {
    return this.http.get<CartDetailsResponse[]>(`${this.apiUrl}/details`);
  }

  /**
   * Add product to cart
   */
  addToCart(request: AddToCartRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, request);
  }

  /**
   * Remove product from cart
   */
  removeFromCart(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }

  /**
   * Update cart item quantity
   */
  updateQuantity(
    productId: string,
    request: UpdateCartQuantityRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${productId}/quantity`,
      request
    );
  }

  /**
   * Save item for later
   */
  saveForLater(productId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${productId}/save`, {});
  }

  /**
   * Move item back to cart from save for later
   */
  moveToCart(productId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${productId}/move`, {});
  }

  /**
   * Update cart count manually (useful after operations)
   */
  updateCartCount(count: number): void {
    this.cartCountSubject.next(count);
  }
}