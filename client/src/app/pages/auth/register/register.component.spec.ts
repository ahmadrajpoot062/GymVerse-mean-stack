import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register', 'isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.registerForm.get('role')?.value).toBe('user');
    expect(component.registerForm.get('acceptTerms')?.value).toBeFalsy();
  });

  it('should validate required fields', () => {
    const form = component.registerForm;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      acceptTerms: true
    });

    expect(form.valid).toBeTruthy();
  });

  it('should validate password match', () => {
    const form = component.registerForm;
    form.patchValue({
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!'
    });

    expect(form.get('confirmPassword')?.errors?.['passwordMismatch']).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalsy();
    component.togglePassword();
    expect(component.showPassword).toBeTruthy();
  });
});
