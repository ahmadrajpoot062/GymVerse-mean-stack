import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  isSubscribing = false;
  newsletterMessage = '';
  newsletterSuccess = false;

  newsletterData = {
    firstName: '',
    email: ''
  };

  constructor(private newsletterService: NewsletterService) {}

  subscribeNewsletter() {
    if (!this.newsletterData.email || !this.newsletterData.firstName) {
      this.showMessage('Please fill in all fields', false);
      return;
    }

    this.isSubscribing = true;
    
    this.newsletterService.subscribe({
      email: this.newsletterData.email,
      firstName: this.newsletterData.firstName,
      preferences: {
        frequency: 'weekly',
        categories: ['fitness', 'nutrition', 'wellness']
      }
    }).subscribe({
      next: (response) => {
        this.showMessage('Successfully subscribed to our newsletter!', true);
        this.newsletterData = { firstName: '', email: '' };
        this.isSubscribing = false;
      },
      error: (error) => {
        this.showMessage(error.error?.message || 'Subscription failed. Please try again.', false);
        this.isSubscribing = false;
      }
    });
  }

  private showMessage(message: string, success: boolean) {
    this.newsletterMessage = message;
    this.newsletterSuccess = success;
    
    setTimeout(() => {
      this.newsletterMessage = '';
    }, 5000);
  }
}
