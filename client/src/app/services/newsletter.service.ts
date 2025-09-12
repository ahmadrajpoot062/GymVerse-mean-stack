import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NewsletterSubscription {
  email: string;
  firstName?: string;
  lastName?: string;
  preferences?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    categories: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = `${environment.apiUrl}/newsletter`;

  constructor(private http: HttpClient) {}

  subscribe(subscription: NewsletterSubscription): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscribe`, subscription);
  }

  unsubscribe(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/unsubscribe`, { email });
  }

  updatePreferences(email: string, preferences: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/preferences`, { email, preferences });
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getSubscribers(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/subscribers`, { params });
  }

  sendCampaign(campaign: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/campaign`, campaign);
  }
}
