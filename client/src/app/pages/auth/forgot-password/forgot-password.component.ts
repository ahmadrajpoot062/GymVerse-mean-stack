import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  get emailControl() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.error = '';
      this.success = '';

      const { email } = this.forgotPasswordForm.value;

      this.authService.forgotPassword({ email }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.success = 'Password reset link has been sent to your email address.';
          this.forgotPasswordForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error.error?.message || 'An error occurred. Please try again.';
          console.error('Forgot password error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }
}
