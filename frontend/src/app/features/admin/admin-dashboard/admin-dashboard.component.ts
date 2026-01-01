// src/app/features/admin/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product, CreateProductRequest, UpdateProductRequest } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="admin-container">
      <h1>Admin Dashboard</h1>

      <!-- Two Column Layout -->
      <div class="admin-layout">
        <!-- Product Form -->
        <section class="form-section">
          <h2>{{ editingProduct ? 'Edit Product' : 'Create Product' }}</h2>

          <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
            <!-- Name -->
            <div class="form-group">
              <label for="name">Product Name</label>
              <input
                id="name"
                type="text"
                class="form-control"
                formControlName="name"
                placeholder="Enter product name"
                [class.is-invalid]="isFieldInvalid('name')"
              />
              <small class="error-text" *ngIf="isFieldInvalid('name')">
                Product name is required
              </small>
            </div>

            <!-- Price -->
            <div class="form-group">
              <label for="price">Price (₹)</label>
              <input
                id="price"
                type="number"
                class="form-control"
                formControlName="price"
                placeholder="Enter price"
                [class.is-invalid]="isFieldInvalid('price')"
              />
              <small class="error-text" *ngIf="isFieldInvalid('price')">
                Price must be a positive number
              </small>
            </div>

            <!-- Type (Category) -->
            <div class="form-group">
              <label for="type">Category</label>
              <select
                id="type"
                class="form-control"
                formControlName="type"
                [class.is-invalid]="isFieldInvalid('type')"
              >
                <option value="">Select Category</option>
                <option value="tshirt">T-Shirt</option>
                <option value="shoes">Shoes</option>
                <option value="jeans">Jeans</option>
                <option value="accessories">Accessories</option>
              </select>
              <small class="error-text" *ngIf="isFieldInvalid('type')">
                Category is required
              </small>
            </div>

            <!-- Color -->
            <div class="form-group">
              <label for="color">Color</label>
              <select
                id="color"
                class="form-control"
                formControlName="color"
                [class.is-invalid]="isFieldInvalid('color')"
              >
                <option value="">Select Color</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="green">Green</option>
              </select>
              <small class="error-text" *ngIf="isFieldInvalid('color')">
                Color is required
              </small>
            </div>

            <!-- Trending Checkbox -->
            <div class="form-group checkbox">
              <label for="isTrending">
                <input
                  id="isTrending"
                  type="checkbox"
                  formControlName="isTrending"
                />
                <span>Mark as Trending</span>
              </label>
            </div>

            <!-- Error Message -->
            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <!-- Success Message -->
            <div class="success-message" *ngIf="successMessage">
              {{ successMessage }}
            </div>

            <!-- Buttons -->
            <div class="form-actions">
              <button
                type="submit"
                class="btn-primary"
                [disabled]="isLoading || !productForm.valid"
              >
                {{ isLoading ? 'Processing...' : (editingProduct ? 'Update Product' : 'Create Product') }}
              </button>
              <button
                type="button"
                class="btn-secondary"
                (click)="onCancelEdit()"
                *ngIf="editingProduct"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>

        <!-- Products List -->
        <section class="list-section">
          <div class="list-header">
            <h2>Products</h2>
            <input
              type="text"
              class="search-input"
              placeholder="Search products..."
              [(ngModel)]="searchQuery"
              (input)="onSearchChange()"
            />
          </div>

          <!-- Loading State -->
          <div class="loading" *ngIf="isLoadingProducts">
            <p>Loading products...</p>
          </div>

          <!-- Products Table -->
          <div class="table-container" *ngIf="!isLoadingProducts && filteredProducts.length > 0">
            <table class="products-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Color</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let product of filteredProducts">
                  <td>{{ product.name }}</td>
                  <td>₹{{ product.price | number: '1.0-0' }}</td>
                  <td>{{ product.type }}</td>
                  <td>
                    <span class="color-badge" [style.background-color]="getColorValue(product.color)">
                      {{ product.color }}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge" [class.trending]="product.isTrending">
                      {{ product.isTrending ? 'Trending' : 'Normal' }}
                    </span>
                  </td>
                  <td class="actions">
                    <button
                      class="btn-edit"
                      (click)="onEditProduct(product)"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      class="btn-delete"
                      (click)="onDeleteProduct(product.id)"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="!isLoadingProducts && products.length === 0">
            <p>No products found. Create your first product!</p>
          </div>

          <!-- No Search Results -->
          <div class="empty-state" *ngIf="!isLoadingProducts && products.length > 0 && filteredProducts.length === 0">
            <p>No products match your search.</p>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-container {
        max-width: 1400px;
        margin: 0 auto;
      }

      h1 {
        font-size: 32px;
        margin-bottom: 30px;
        color: #333;
      }

      .admin-layout {
        display: grid;
        grid-template-columns: 400px 1fr;
        gap: 30px;
      }

      /* Form Section */
      .form-section {
        background: white;
        padding: 25px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        height: fit-content;
        position: sticky;
        top: 20px;
      }

      .form-section h2 {
        font-size: 20px;
        margin-bottom: 20px;
        color: #333;
      }

      .form-group {
        margin-bottom: 20px;
      }

      label {
        display: block;
        margin-bottom: 8px;
        color: #333;
        font-weight: 600;
        font-size: 14px;
      }

      .form-control {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
        font-family: inherit;
        transition: border-color 0.3s;
      }

      .form-control:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .form-control.is-invalid {
        border-color: #e74c3c;
      }

      .error-text {
        display: block;
        color: #e74c3c;
        font-size: 12px;
        margin-top: 5px;
      }

      .checkbox label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
      }

      .checkbox input {
        margin: 0;
      }

      .error-message {
        background-color: #ffe6e6;
        color: #c0392b;
        padding: 12px;
        border-radius: 5px;
        margin-bottom: 20px;
        font-size: 14px;
        border-left: 4px solid #c0392b;
      }

      .success-message {
        background-color: #e6ffe6;
        color: #27ae60;
        padding: 12px;
        border-radius: 5px;
        margin-bottom: 20px;
        font-size: 14px;
        border-left: 4px solid #27ae60;
      }

      .form-actions {
        display: flex;
        gap: 10px;
      }

      .btn-primary,
      .btn-secondary {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: opacity 0.3s;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        opacity: 0.9;
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-secondary {
        background: #f0f0f0;
        color: #333;
      }

      .btn-secondary:hover {
        background: #e0e0e0;
      }

      /* List Section */
      .list-section {
        background: white;
        padding: 25px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
      }

      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 15px;
      }

      .list-header h2 {
        font-size: 20px;
        margin: 0;
        color: #333;
      }

      .search-input {
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
        width: 250px;
      }

      .loading {
        text-align: center;
        padding: 40px;
        color: #667eea;
        font-size: 16px;
      }

      .table-container {
        overflow-x: auto;
      }

      .products-table {
        width: 100%;
        border-collapse: collapse;
      }

      .products-table thead {
        background: #f9f9f9;
        border-bottom: 2px solid #667eea;
      }

      .products-table th {
        padding: 12px;
        text-align: left;
        font-weight: 600;
        color: #333;
        font-size: 13px;
      }

      .products-table td {
        padding: 12px;
        border-bottom: 1px solid #e0e0e0;
        font-size: 14px;
      }

      .products-table tbody tr:hover {
        background: #f9f9f9;
      }

      .color-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        color: white;
        font-size: 12px;
        font-weight: 600;
      }

      .status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        background: #f0f0f0;
        color: #666;
        font-size: 12px;
        font-weight: 600;
      }

      .status-badge.trending {
        background: #ffeb3b;
        color: #333;
      }

      .actions {
        display: flex;
        gap: 8px;
      }

      .btn-edit,
      .btn-delete {
        background: white;
        border: 1px solid #ddd;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
      }

      .btn-edit:hover {
        background: #e6f2ff;
      }

      .btn-delete:hover {
        background: #ffe6e6;
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #999;
        font-size: 16px;
      }

      @media (max-width: 1024px) {
        .admin-layout {
          grid-template-columns: 1fr;
        }

        .form-section {
          position: static;
        }
      }

      @media (max-width: 768px) {
        .list-header {
          flex-direction: column;
          align-items: stretch;
        }

        .search-input {
          width: 100%;
        }

        .products-table {
          font-size: 12px;
        }

        .products-table th,
        .products-table td {
          padding: 8px;
        }
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  productForm!: FormGroup;
  isLoading = false;
  isLoadingProducts = false;
  errorMessage = '';
  successMessage = '';
  searchQuery = '';
  editingProduct: Product | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProducts();
  }

  private initializeForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      type: ['', Validators.required],
      color: ['', Validators.required],
      isTrending: [false],
    });
  }

  private loadProducts(): void {
    this.isLoadingProducts = true;
    // Load all products by category (using empty type for all)
    this.productService
      .queryProducts({ limit: 100 })
      .subscribe({
        next: (response) => {
          this.products = response.items;
          this.isLoadingProducts = false;
        },
        error: (error) => {
          this.isLoadingProducts = false;
          console.error('Error loading products:', error);
        },
      });
  }

  get filteredProducts(): Product[] {
    if (!this.searchQuery) {
      return this.products;
    }
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.color.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSubmit(): void {
    if (!this.productForm.valid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.editingProduct) {
      // Update existing product
      const updateRequest: UpdateProductRequest = {
        name: this.productForm.get('name')?.value,
        price: parseFloat(this.productForm.get('price')?.value),
        type: this.productForm.get('type')?.value,
        color: this.productForm.get('color')?.value,
        isTrending: this.productForm.get('isTrending')?.value,
      };

      this.productService
        .updateProduct(this.editingProduct.id, updateRequest)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.successMessage = 'Product updated successfully!';
            this.productForm.reset();
            this.editingProduct = null;
            setTimeout(() => {
              this.loadProducts();
              this.successMessage = '';
            }, 2000);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error?.error?.message || 'Failed to update product';
          },
        });
    } else {
      // Create new product
      const createRequest: CreateProductRequest = {
        name: this.productForm.get('name')?.value,
        price: parseFloat(this.productForm.get('price')?.value),
        type: this.productForm.get('type')?.value,
        color: this.productForm.get('color')?.value,
        isTrending: this.productForm.get('isTrending')?.value,
      };

      this.productService.createProduct(createRequest).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Product created successfully!';
          this.productForm.reset();
          setTimeout(() => {
            this.loadProducts();
            this.successMessage = '';
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error?.error?.message || 'Failed to create product';
        },
      });
    }
  }

  onEditProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      type: product.type,
      color: product.color,
      isTrending: product.isTrending,
    });
    window.scrollTo(0, 0);
  }

  onCancelEdit(): void {
    this.editingProduct = null;
    this.productForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  onDeleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.successMessage = 'Product deleted successfully!';
          setTimeout(() => {
            this.loadProducts();
            this.successMessage = '';
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Failed to delete product';
        },
      });
    }
  }

  onSearchChange(): void {
    // Search is handled by getter
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getColorValue(color: string): string {
    const colorMap: { [key: string]: string } = {
      red: '#ff6b6b',
      blue: '#4ecdc4',
      black: '#2c3e50',
      white: '#ecf0f1',
      green: '#27ae60',
    };
    return colorMap[color] || '#999';
  }
}