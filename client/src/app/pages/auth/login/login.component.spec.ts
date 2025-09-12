import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should validate required fields', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');

    expect(emailControl?.invalid).toBeTrue();
    expect(passwordControl?.invalid).toBeTrue();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.invalid).toBeTrue();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePassword();
    expect(component.showPassword).toBeTrue();
  });

  it('should handle successful login', () => {
    const mockResponse = { 
      success: true,
      token: 'mock-token', 
      user: { 
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user' as const,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      } 
    };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('should handle login error', () => {
    const mockError = { error: { message: 'Invalid credentials' } };
    authService.login.and.returnValue(throwError(() => mockError));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBe('Invalid credentials');
  });

  it('should not submit when form is invalid', () => {
    component.loginForm.patchValue({
      email: 'invalid-email',
      password: ''
    });

    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should set loading state during login process', () => {
    const mockResponse = { 
      success: true,
      token: 'mock-token', 
      user: { 
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user' as const,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      } 
    };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    // Before calling onSubmit
    expect(component.isLoading).toBeFalse();

    component.onSubmit();

    // After the observable completes, loading should be false
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error without message property', () => {
    const mockError = { error: {} };
    authService.login.and.returnValue(throwError(() => mockError));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    component.onSubmit();

    expect(component.isLoading).toBeFalse();
    expect(component.error).toBe('An error occurred during login. Please try again.');
  });
});
