import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss'
})
export class NewsletterComponent {
  newsletterForm: FormGroup;
  isLoading = false;
  message = '';
  isSuccess = false;

  constructor(
    private formBuilder: FormBuilder,
    private newsletterService: NewsletterService
  ) {
    this.newsletterForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.newsletterForm.valid) {
      this.isLoading = true;
      this.message = '';

      const { email } = this.newsletterForm.value;

      this.newsletterService.subscribe({ email }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isSuccess = true;
          this.message = 'Thank you for subscribing! Check your email for confirmation.';
          this.newsletterForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.isSuccess = false;
          this.message = error.error?.message || 'Subscription failed. Please try again.';
        }
      });
    } else {
      this.newsletterForm.markAllAsTouched();
    }
  }

  get emailControl() {
    return this.newsletterForm.get('email');
  }
}
