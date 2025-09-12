import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ForgotPasswordRequest, 
  ResetPasswordRequest 
} from '../models/user.model';
import { ApiResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map(response => response.data!),
        tap(authResponse => {
          this.setSession(authResponse);
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/register`, userData)
      .pipe(
        map(response => response.data!),
        tap(authResponse => {
          this.setSession(authResponse);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<any> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/forgot-password`, request)
      .pipe(catchError(this.handleError));
  }

  resetPassword(request: ResetPasswordRequest): Observable<any> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/reset-password`, request)
      .pipe(catchError(this.handleError));
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/me`)
      .pipe(
        map(response => response.data!),
        tap(user => {
          this.currentUserSubject.next(user);
          this.updateStoredUser(user);
        }),
        catchError(this.handleError)
      );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/profile`, userData)
      .pipe(
        map(response => response.data!),
        tap(user => {
          this.currentUserSubject.next(user);
          this.updateStoredUser(user);
        }),
        catchError(this.handleError)
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/change-password`, {
      currentPassword,
      newPassword
    }).pipe(catchError(this.handleError));
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUserValue();
    return user ? user.role === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isTrainer(): boolean {
    return this.hasRole('trainer');
  }

  isUser(): boolean {
    return this.hasRole('user');
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    this.currentUserSubject.next(authResponse.user);
    this.isAuthenticatedSubject.next(true);
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private updateStoredUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private handleError(error: any) {
    console.error('Auth error:', error);
    
    if (error.status === 401) {
      // Unauthorized - token might be expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return throwError(() => error);
  }
}
