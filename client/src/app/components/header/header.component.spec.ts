import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'isAdmin'], {
      isAuthenticated$: of(false),
      currentUser$: of(null)
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle mobile menu', () => {
    expect(component.showMobileMenu).toBeFalse();
    component.toggleMobileMenu();
    expect(component.showMobileMenu).toBeTrue();
  });

  it('should toggle user menu', () => {
    expect(component.showUserMenu).toBeFalse();
    component.toggleUserMenu();
    expect(component.showUserMenu).toBeTrue();
  });

  it('should close mobile menu when user menu is opened', () => {
    component.showMobileMenu = true;
    component.toggleUserMenu();
    expect(component.showMobileMenu).toBeFalse();
    expect(component.showUserMenu).toBeTrue();
  });

  it('should call authService.logout when logout is clicked', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(component.showUserMenu).toBeFalse();
  });
});
