import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  DecodedToken,
} from '../../shared/models/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  /**
   * Register a new user
   */
  register(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, request);
  }

  /**
   * Login user and store JWT
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap((response) => {
          // Store JWT token
          localStorage.setItem(environment.jwtTokenKey, response.accessToken);
          // Decode and set current user
          const decodedToken = this.decodeToken(response.accessToken);
          if (decodedToken) {
            const user: User = {
              id: decodedToken.sub,
              email: decodedToken.email,
              role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
            };
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(environment.jwtTokenKey);
    this.currentUserSubject.next(null);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    console.log('Current User:', this.currentUserSubject.value);
    const token = localStorage.getItem(environment.jwtTokenKey);
    if (!token) return false;

    const decodedToken = this.decodeToken(token);
    if (!decodedToken) return false;

    // Check if token is expired
    const isExpired = decodedToken.exp * 1000 < Date.now();
    if (isExpired) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    console.log('Current User:', this.currentUserSubject.value);
    return this.currentUserSubject.value?.role === 'ADMIN';
  }

  /**
   * Decode JWT token (basic decoding, no verification)
   */
  private decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }

  /**
   * Load user from stored token on app initialization
   */
  private loadUserFromToken(): void {
    const token = localStorage.getItem(environment.jwtTokenKey);
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken) {
        const isExpired = decodedToken.exp * 1000 < Date.now();
        if (!isExpired) {
          const user: User = {
            id: decodedToken.sub,
            email: decodedToken.email,
            role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          };
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
      }
    }
  }
}