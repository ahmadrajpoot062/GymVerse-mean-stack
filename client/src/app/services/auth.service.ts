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
    return this.http.post<any>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map(response => {
          // Handle different response formats from the server
          if (response.success && response.token && response.user) {
            return {
              success: response.success,
              token: response.token,
              user: this.normalizeUserObject(response.user),
              message: response.message
            };
          } else if (response.data) {
            return {
              success: response.success,
              token: response.data.token,
              user: this.normalizeUserObject(response.data.user),
              message: response.message
            };
          }
          throw new Error('Invalid response format');
        }),
        tap(authResponse => {
          const rememberMe = credentials.rememberMe ?? false;
          this.setSession(authResponse, rememberMe);
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<any>(`${this.baseUrl}/register`, userData)
      .pipe(
        map(response => {
          // Handle different response formats from the server
          if (response.success && response.token && response.user) {
            return {
              success: response.success,
              token: response.token,
              user: this.normalizeUserObject(response.user),
              message: response.message || 'Registration successful! Please log in.'
            };
          } else if (response.data) {
            return {
              success: response.success,
              token: response.data.token,
              user: this.normalizeUserObject(response.data.user),
              message: response.message || 'Registration successful! Please log in.'
            };
          }
          throw new Error('Invalid response format');
        }),
        // Don't automatically set session after registration
        // We want the user to explicitly log in instead
        catchError(this.handleError)
      );
  }

  logout(): void {
    // Clear both localStorage and sessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
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
    // Check sessionStorage first, then localStorage
    return sessionStorage.getItem('token') || localStorage.getItem('token');
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

  private setSession(authResponse: AuthResponse, rememberMe: boolean = false): void {
    // Use localStorage for remember me, sessionStorage otherwise
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem('token', authResponse.token);
    storage.setItem('user', JSON.stringify(authResponse.user));
    
    this.currentUserSubject.next(authResponse.user);
    this.isAuthenticatedSubject.next(true);
  }

  private getStoredUser(): User | null {
    // Check sessionStorage first, then localStorage
    const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private updateStoredUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private handleError(error: any) {
    console.error('Auth error:', error);
    
    // Log more detailed error information
    if (error.error) {
      console.error('Error details:', JSON.stringify(error.error));
    }
    
    if (error.status === 401) {
      // Unauthorized - token might be expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return throwError(() => error);
  }

  /**
   * Normalizes the user object from the server response
   * Handles the difference between 'id' and '_id' properties
   */
  private normalizeUserObject(user: any): User {
    // Create a new user object with expected properties
    return {
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage || user.profile?.avatar,
      phone: user.phone || user.profile?.phone,
      isActive: user.isActive !== undefined ? user.isActive : true,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
      ...user
    } as User;
  }
}
