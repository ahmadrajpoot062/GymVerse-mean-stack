import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isLoading = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  get nameControl() {
    return this.contactForm.get('name');
  }

  get emailControl() {
    return this.contactForm.get('email');
  }

  get subjectControl() {
    return this.contactForm.get('subject');
  }

  get messageControl() {
    return this.contactForm.get('message');
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.error = '';
      this.success = '';

      const formData = this.contactForm.value;

      this.http.post(`${environment.apiUrl}/messages/contact`, formData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.success = 'Thank you for your message! We\'ll get back to you soon.';
          this.contactForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error.error?.message || 'An error occurred while sending your message. Please try again.';
          console.error('Contact form error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }
}
