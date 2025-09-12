import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { ExercisePlansComponent } from './exercise-plans.component';

describe('ExercisePlansComponent', () => {
  let component: ExercisePlansComponent;
  let fixture: ComponentFixture<ExercisePlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisePlansComponent, NoopAnimationsModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercisePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with all exercise plans', () => {
    expect(component.filteredPlans.length).toBeGreaterThan(0);
    expect(component.filteredPlans.length).toBe(component.exercisePlans.length);
  });

  it('should filter plans by category', () => {
    component.setActiveCategory('Strength');
    expect(component.activeCategory).toBe('Strength');
    expect(component.filteredPlans.every(p => p.category === 'Strength')).toBeTruthy();
  });

  it('should filter plans by difficulty', () => {
    component.selectedDifficulty = 'Beginner';
    component.filterPlans();
    expect(component.filteredPlans.every(p => p.difficulty === 'Beginner')).toBeTruthy();
  });

  it('should search plans by title', () => {
    component.searchTerm = 'HIIT';
    component.filterPlans();
    expect(component.filteredPlans.some(p => p.title.includes('HIIT'))).toBeTruthy();
  });

  it('should have featured exercise', () => {
    expect(component.featuredExercise).toBeTruthy();
    expect(component.featuredExercise.name).toBeTruthy();
    expect(component.featuredExercise.sets).toBeGreaterThan(0);
  });

  it('should handle plan selection', () => {
    spyOn(window, 'alert');
    const testPlan = component.exercisePlans[0];
    component.selectPlan(testPlan);
    expect(window.alert).toHaveBeenCalledWith(jasmine.stringContaining(testPlan.title));
  });

  it('should handle video playback', () => {
    spyOn(window, 'alert');
    component.playExerciseVideo(component.featuredExercise);
    expect(window.alert).toHaveBeenCalledWith(jasmine.stringContaining(component.featuredExercise.name));
  });
});
