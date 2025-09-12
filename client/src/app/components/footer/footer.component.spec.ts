import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { NewsletterService } from '../../services/newsletter.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let newsletterService: jasmine.SpyObj<NewsletterService>;

  beforeEach(async () => {
    const newsletterServiceSpy = jasmine.createSpyObj('NewsletterService', ['subscribe']);

    await TestBed.configureTestingModule({
      imports: [FooterComponent, RouterTestingModule],
      providers: [
        { provide: NewsletterService, useValue: newsletterServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    newsletterService = TestBed.inject(NewsletterService) as jasmine.SpyObj<NewsletterService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });

  it('should subscribe to newsletter successfully', () => {
    component.newsletterData = {
      firstName: 'John',
      email: 'john@example.com'
    };

    newsletterService.subscribe.and.returnValue(of({ success: true }));

    component.subscribeNewsletter();

    expect(newsletterService.subscribe).toHaveBeenCalled();
    expect(component.newsletterMessage).toContain('Successfully subscribed');
    expect(component.newsletterSuccess).toBeTrue();
  });

  it('should handle newsletter subscription error', () => {
    component.newsletterData = {
      firstName: 'John',
      email: 'john@example.com'
    };

    newsletterService.subscribe.and.returnValue(throwError(() => ({ error: { message: 'Subscription failed' } })));

    component.subscribeNewsletter();

    expect(component.newsletterMessage).toContain('Subscription failed');
    expect(component.newsletterSuccess).toBeFalse();
  });

  it('should validate required fields', () => {
    component.newsletterData = {
      firstName: '',
      email: ''
    };

    component.subscribeNewsletter();

    expect(newsletterService.subscribe).not.toHaveBeenCalled();
    expect(component.newsletterMessage).toContain('Please fill in all fields');
  });
});
