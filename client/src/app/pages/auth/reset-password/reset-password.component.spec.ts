import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: { params: { token: 'mock-token' } }
    };

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate password match', () => {
    const form = component.resetPasswordForm;
    form.patchValue({
      password: 'password123',
      confirmPassword: 'different123'
    });

    expect(form.get('confirmPassword')?.errors?.['passwordMismatch']).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalsy();
    component.togglePassword();
    expect(component.showPassword).toBeTruthy();
  });

  it('should toggle confirm password visibility', () => {
    expect(component.showConfirmPassword).toBeFalsy();
    component.toggleConfirmPassword();
    expect(component.showConfirmPassword).toBeTruthy();
  });
});
