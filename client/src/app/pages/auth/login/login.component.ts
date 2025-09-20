import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }
    
    // Check if there's a success message from registration
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { message: string, email?: string };
    
    if (state?.message) {
      setTimeout(() => {
        // Show success message using toast service
        this.toastService.success(state.message);
        
        // Also pre-fill the email if it was passed in the state
        if (state.email && this.emailControl) {
          this.emailControl.setValue(state.email);
        }
      }, 100);
    }
  }
  
  // Method kept for backward compatibility
  showSuccessMessage(message: string): void {
    this.toastService.success(message);
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
  
  get rememberMeControl() {
    return this.loginForm.get('rememberMe');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const { email, password, rememberMe } = this.loginForm.value;

      this.authService.login({ email, password, rememberMe }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastService.success('Login successful! Welcome back.');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.isLoading = false;
          
          // Get a more detailed error message if available
          let errorMessage: string;
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error.error) {
              errorMessage = error.error.error;
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = `Login failed: ${error.status} ${error.statusText}`;
            }
          } else {
            errorMessage = 'An error occurred during login. Please try again.';
          }
          
          // Show error message in toast only
          this.toastService.error(errorMessage);
          
          console.error('Login error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
