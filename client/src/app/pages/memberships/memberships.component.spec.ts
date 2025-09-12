import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MembershipsComponent } from './memberships.component';

describe('MembershipsComponent', () => {
  let component: MembershipsComponent;
  let fixture: ComponentFixture<MembershipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipsComponent, BrowserAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have membership plans', () => {
    expect(component.membershipPlans).toBeDefined();
    expect(component.membershipPlans.length).toBeGreaterThan(0);
  });

  it('should have basic, premium, and elite plans', () => {
    const planNames = component.membershipPlans.map(plan => plan.name.toLowerCase());
    expect(planNames).toContain('basic');
    expect(planNames).toContain('premium');
    expect(planNames).toContain('elite');
  });

  it('should mark premium plan as popular', () => {
    const premiumPlan = component.membershipPlans.find(plan => plan.name.toLowerCase() === 'premium');
    expect(premiumPlan?.popular).toBeTruthy();
  });

  it('should have comparison features', () => {
    expect(component.comparisonFeatures).toBeDefined();
    expect(component.comparisonFeatures.length).toBeGreaterThan(0);
  });

  it('should have testimonials', () => {
    expect(component.testimonials).toBeDefined();
    expect(component.testimonials.length).toBeGreaterThan(0);
  });

  it('should have FAQs', () => {
    expect(component.faqs).toBeDefined();
    expect(component.faqs.length).toBeGreaterThan(0);
  });

  it('should toggle FAQ open state', () => {
    const initialState = component.faqs[0].open;
    component.toggleFAQ(0);
    expect(component.faqs[0].open).toBe(!initialState);
  });

  it('should get correct plan card class for popular plan', () => {
    const popularPlan = component.membershipPlans.find(plan => plan.popular);
    if (popularPlan) {
      const cardClass = component.getPlanCardClass(popularPlan);
      expect(cardClass).toContain('border-4 border-yellow-400');
      expect(cardClass).toContain('transform scale-105');
    }
  });

  it('should get correct button class for popular plan', () => {
    const popularPlan = component.membershipPlans.find(plan => plan.popular);
    if (popularPlan) {
      const buttonClass = component.getButtonClass(popularPlan);
      expect(buttonClass).toContain('bg-gradient-to-r from-red-600 to-red-700');
    }
  });
});
