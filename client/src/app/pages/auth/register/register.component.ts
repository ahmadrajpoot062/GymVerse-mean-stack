import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?&#^()_\-+=,;:~])[A-Za-z\d.@$!%*?&#^()_\-+=,;:~]+$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      role: ['user', [Validators.required]],
      phone: [''],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword.errors) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
      return null;
    }
  }

  get nameControl() {
    return this.registerForm.get('name');
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }

  get acceptTermsControl() {
    return this.registerForm.get('acceptTerms');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    // Mark all fields as touched to trigger validation display
    this.markFormGroupTouched();
    
    if (this.registerForm.valid) {
      this.isLoading = true;

      const { name, email, password, role, phone } = this.registerForm.value;

      this.authService.register({ name, email, password, role, phone }).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          const successMessage = 'Account created successfully! Please log in with your credentials.';
          
          // Show toast notification
          this.toastService.success(successMessage);
          
          // Pass success message to login page via state, along with the email
          this.router.navigate(['/auth/login'], { 
            state: { 
              message: successMessage,
              email: email
            } 
          });
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
              errorMessage = `Registration failed: ${error.status} ${error.statusText}`;
            }
          } else {
            errorMessage = 'An error occurred during registration. Please try again.';
          }
          
          // Show error in toast only
          this.toastService.error(errorMessage);
          
          console.error('Registration error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
  
  // Check if a specific field is valid
  isFieldValid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return control ? control.valid && (control.dirty || control.touched) : false;
  }
  
  // Get all form validation errors (useful for debugging)
  getFormValidationErrors(): string[] {
    const result: string[] = [];
    Object.keys(this.registerForm.controls).forEach(key => {
      const controlErrors = this.registerForm.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push(`${key}: ${keyError}`);
        });
      }
    });
    return result;
  }
}
