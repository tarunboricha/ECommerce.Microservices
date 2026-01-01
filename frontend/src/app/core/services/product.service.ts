// src/app/core/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  CursorQueryParameters,
  CursorPagedResponse,
} from '../../shared/models/models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) { }

  /**
   * Get trending products (PUBLIC)
   */
  getTrending(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/trending`);
  }

  /**
   * Get products by type/category (PUBLIC)
   */
  getByType(type: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/type/${type}`);
  }

  /**
   * Query products with cursor pagination and filters (PUBLIC)
   * This is the MAIN endpoint for shop page
   */
  queryProducts(params: CursorQueryParameters): Observable<CursorPagedResponse> {
    console.log('Query Params:', params);
    return this.http.post<CursorPagedResponse>(
      `${this.apiUrl}/query`,
      params
    );
  }

  /**
   * Get products by IDs (for cart aggregation)
   */
  getByIds(ids: string[]): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.apiUrl}/bulk`, ids);
  }

  /**
   * Create product (ADMIN ONLY)
   */
  createProduct(request: CreateProductRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, request);
  }

  /**
   * Update product (ADMIN ONLY)
   */
  updateProduct(id: string, request: UpdateProductRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete product (ADMIN ONLY)
   */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}