import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NewsletterComponent } from './newsletter.component';
import { NewsletterService } from '../../services/newsletter.service';
import { of, throwError } from 'rxjs';

describe('NewsletterComponent', () => {
  let component: NewsletterComponent;
  let fixture: ComponentFixture<NewsletterComponent>;
  let newsletterService: jasmine.SpyObj<NewsletterService>;

  beforeEach(async () => {
    const newsletterServiceSpy = jasmine.createSpyObj('NewsletterService', ['subscribe']);

    await TestBed.configureTestingModule({
      imports: [NewsletterComponent, ReactiveFormsModule],
      providers: [
        { provide: NewsletterService, useValue: newsletterServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsletterComponent);
    component = fixture.componentInstance;
    newsletterService = TestBed.inject(NewsletterService) as jasmine.SpyObj<NewsletterService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize newsletter form', () => {
    expect(component.newsletterForm).toBeDefined();
    expect(component.newsletterForm.get('email')).toBeDefined();
  });

  it('should validate email field', () => {
    const emailControl = component.newsletterForm.get('email');
    
    emailControl?.setValue('');
    expect(emailControl?.invalid).toBeTrue();
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.invalid).toBeTrue();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should handle successful subscription', () => {
    const mockResponse = { success: true, message: 'Subscribed successfully' };
    newsletterService.subscribe.and.returnValue(of(mockResponse));

    component.newsletterForm.patchValue({
      email: 'test@example.com'
    });

    component.onSubmit();

    expect(newsletterService.subscribe).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(component.isLoading).toBeFalse();
    expect(component.isSuccess).toBeTrue();
  });

  it('should handle subscription error', () => {
    const mockError = { error: { message: 'Subscription failed' } };
    newsletterService.subscribe.and.returnValue(throwError(() => mockError));

    component.newsletterForm.patchValue({
      email: 'test@example.com'
    });

    component.onSubmit();

    expect(component.isLoading).toBeFalse();
    expect(component.isSuccess).toBeFalse();
    expect(component.message).toBe('Subscription failed');
  });

  it('should not submit when form is invalid', () => {
    component.newsletterForm.patchValue({
      email: 'invalid-email'
    });

    component.onSubmit();

    expect(newsletterService.subscribe).not.toHaveBeenCalled();
    expect(component.newsletterForm.get('email')?.touched).toBeTrue();
  });

  it('should reset form after successful subscription', () => {
    const mockResponse = { success: true, message: 'Subscribed successfully' };
    newsletterService.subscribe.and.returnValue(of(mockResponse));

    component.newsletterForm.patchValue({
      email: 'test@example.com'
    });

    component.onSubmit();

    expect(component.newsletterForm.get('email')?.value).toBeNull();
  });
});
