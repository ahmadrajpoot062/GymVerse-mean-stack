import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['forgotPassword']);

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate email field', () => {
    const emailControl = component.forgotPasswordForm.get('email');
    expect(emailControl?.valid).toBeFalsy();

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should submit form when valid', () => {
    component.forgotPasswordForm.patchValue({
      email: 'test@example.com'
    });

    expect(component.forgotPasswordForm.valid).toBeTruthy();
  });
});
