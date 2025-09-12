import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseAnimationComponent } from './exercise-animation.component';

describe('ExerciseAnimationComponent', () => {
  let component: ExerciseAnimationComponent;
  let fixture: ComponentFixture<ExerciseAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseAnimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.exerciseName).toBe('');
    expect(component.exerciseType).toBe('');
    expect(component.category).toBe('');
    expect(component.difficulty).toBe('');
    expect(component.isAnimating).toBe(true);
  });

  it('should setup animation based on exercise type', () => {
    component.exerciseName = 'Pushup';
    component.ngOnInit();
    expect(component.animationClass).toBe('pushup-animation');
  });

  it('should show equipment for strength exercises', () => {
    component.category = 'strength';
    component.ngOnInit();
    expect(component.showEquipment).toBe(true);
  });

  it('should cleanup animation interval on destroy', () => {
    component.ngOnInit();
    spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(clearInterval).toHaveBeenCalled();
  });
});
