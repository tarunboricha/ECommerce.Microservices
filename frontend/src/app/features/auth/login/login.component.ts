// src/app/features/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../shared/models/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Login</h1>
        <p class="subtitle">Sign in to your account</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <!-- Email -->
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              class="form-control"
              formControlName="email"
              placeholder="Enter your email"
              [class.is-invalid]="isFieldInvalid('email')"
            />
            <small class="error-text" *ngIf="isFieldInvalid('email')">
              {{ getErrorMessage('email') }}
            </small>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              class="form-control"
              formControlName="password"
              placeholder="Enter your password"
              [class.is-invalid]="isFieldInvalid('password')"
            />
            <small class="error-text" *ngIf="isFieldInvalid('password')">
              {{ getErrorMessage('password') }}
            </small>
          </div>

          <!-- Error Message -->
          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn-primary"
            [disabled]="isLoading || !loginForm.valid"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Register Link -->
        <p class="register-link">
          Don't have an account?
          <a routerLink="/auth/register">Create one</a>
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
      }

      .auth-card {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 400px;
      }

      h1 {
        text-align: center;
        color: #333;
        margin-bottom: 10px;
        font-size: 28px;
      }

      .subtitle {
        text-align: center;
        color: #666;
        margin-bottom: 30px;
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
        padding: 12px;
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

      .error-message {
        background-color: #ffe6e6;
        color: #c0392b;
        padding: 12px;
        border-radius: 5px;
        margin-bottom: 20px;
        font-size: 14px;
        border-left: 4px solid #c0392b;
      }

      .btn-primary {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.3s;
      }

      .btn-primary:hover:not(:disabled) {
        opacity: 0.9;
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .register-link {
        text-align: center;
        margin-top: 20px;
        color: #666;
        font-size: 14px;
      }

      .register-link a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
      }

      .register-link a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = {
      email: this.loginForm.get('email')!.value,
      password: this.loginForm.get('password')!.value,
    };

    this.authService.login(loginRequest).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error?.error?.message || 'Invalid email or password';
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least 6 characters`;
    }
    return '';
  }
}