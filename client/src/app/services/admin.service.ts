import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getUsers(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, { params });
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  getTrainers(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/trainers`, { params });
  }

  approveTrainer(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/trainers/${id}/approve`, {});
  }

  rejectTrainer(id: string, reason?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/trainers/${id}/reject`, { reason });
  }

  getPrograms(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/programs`, { params });
  }

  updateProgram(id: string, programData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/programs/${id}`, programData);
  }

  deleteProgram(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/programs/${id}`);
  }

  getSystemHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/system/health`);
  }

  getAnalytics(period?: string): Observable<any> {
    const params: any = {};
    if (period) {
      params.period = period;
    }
    return this.http.get(`${this.apiUrl}/analytics`, { params });
  }
}
