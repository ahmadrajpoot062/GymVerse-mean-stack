import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { DietPlansComponent } from './diet-plans.component';

describe('DietPlansComponent', () => {
  let component: DietPlansComponent;
  let fixture: ComponentFixture<DietPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietPlansComponent, NoopAnimationsModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DietPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with all diet plans', () => {
    expect(component.filteredPlans.length).toBeGreaterThan(0);
    expect(component.filteredPlans.length).toBe(component.dietPlans.length);
  });

  it('should filter plans by goal', () => {
    component.setActiveGoal('Weight Loss');
    expect(component.activeGoal).toBe('Weight Loss');
    expect(component.filteredPlans.every(p => p.goal === 'Weight Loss')).toBeTruthy();
  });

  it('should filter plans by difficulty', () => {
    component.selectedDifficulty = 'Easy';
    component.filterPlans();
    expect(component.filteredPlans.every(p => p.difficulty === 'Easy')).toBeTruthy();
  });

  it('should filter plans by calorie range', () => {
    component.selectedCalorieRange = '1200-1500';
    component.filterPlans();
    expect(component.filteredPlans.every(p => p.totalCalories >= 1200 && p.totalCalories <= 1500)).toBeTruthy();
  });

  it('should search plans by title', () => {
    component.searchTerm = 'Mediterranean';
    component.filterPlans();
    expect(component.filteredPlans.some(p => p.title.includes('Mediterranean'))).toBeTruthy();
  });

  it('should have featured meal', () => {
    expect(component.featuredMeal).toBeTruthy();
    expect(component.featuredMeal.name).toBeTruthy();
    expect(component.featuredMeal.calories).toBeGreaterThan(0);
  });

  it('should have nutrition tips', () => {
    expect(component.nutritionTips.length).toBeGreaterThan(0);
    expect(component.nutritionTips[0].title).toBeTruthy();
    expect(component.nutritionTips[0].description).toBeTruthy();
  });
});
