// User Models
export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Product Models
export interface Product {
  id: string;
  name: string;
  price: number;
  type: string; // category
  color: string;
  isTrending: boolean;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  type: string;
  color: string;
  isTrending: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  type?: string;
  color?: string;
  isTrending?: boolean;
}

// Cart Models
export interface CartItem {
  productId: string;
  quantity: number;
  saveForLater: boolean;
}

export interface CartDetailsResponse {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  saveForLater: boolean;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartQuantityRequest {
  quantity: number;
}

// Product Query (Cursor Pagination)
export interface CursorQueryParameters {
  type?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  isTrending?: boolean | null;
  limit?: number;
  cursor?: string | null;
}

export interface CursorPagedResponse {
  items: Product[];
  hasMore: boolean;
  nextCursor: string | null;
}

// JWT Decoded Token
export interface DecodedToken {
  sub: string; // userId
  email: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'USER' | 'ADMIN';
  exp: number;
}