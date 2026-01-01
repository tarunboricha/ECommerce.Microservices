// src/app/features/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../shared/models/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Create Account</h1>
        <p class="subtitle">Join our e-commerce platform</p>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <!-- First Name -->
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              class="form-control"
              formControlName="firstName"
              placeholder="Enter your first name"
              [class.is-invalid]="isFieldInvalid('firstName')"
            />
            <small class="error-text" *ngIf="isFieldInvalid('firstName')">
              {{ getErrorMessage('firstName') }}
            </small>
          </div>

          <!-- Last Name -->
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              class="form-control"
              formControlName="lastName"
              placeholder="Enter your last name"
              [class.is-invalid]="isFieldInvalid('lastName')"
            />
            <small class="error-text" *ngIf="isFieldInvalid('lastName')">
              {{ getErrorMessage('lastName') }}
            </small>
          </div>

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

          <!-- Confirm Password -->
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              class="form-control"
              formControlName="confirmPassword"
              placeholder="Confirm your password"
              [class.is-invalid]="isFieldInvalid('confirmPassword')"
            />
            <small class="error-text" *ngIf="isFieldInvalid('confirmPassword')">
              {{ getErrorMessage('confirmPassword') }}
            </small>
          </div>

          <!-- Error Message -->
          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn-primary"
            [disabled]="isLoading || !registerForm.valid"
          >
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Login Link -->
        <p class="login-link">
          Already have an account?
          <a routerLink="/auth/login">Sign in</a>
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

      .success-message {
        background-color: #e6ffe6;
        color: #27ae60;
        padding: 12px;
        border-radius: 5px;
        margin-bottom: 20px;
        font-size: 14px;
        border-left: 4px solid #27ae60;
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

      .login-link {
        text-align: center;
        margin-top: 20px;
        color: #666;
        font-size: 14px;
      }

      .login-link a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
      }

      .login-link a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (!this.registerForm.valid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registerRequest: RegisterRequest = {
      firstName: this.registerForm.get('firstName')!.value,
      lastName: this.registerForm.get('lastName')!.value,
      email: this.registerForm.get('email')!.value,
      password: this.registerForm.get('password')!.value,
    };


    this.authService.register(registerRequest).subscribe({
      next: () => {
        this.successMessage = 'Account created successfully! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error?.error?.message || 'Failed to create account';
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (field?.hasError('minlength')) {
      return `Password must be at least 6 characters`;
    }
    if (field?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
}