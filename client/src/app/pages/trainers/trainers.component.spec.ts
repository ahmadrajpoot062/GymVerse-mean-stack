import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TrainersComponent } from './trainers.component';

describe('TrainersComponent', () => {
  let component: TrainersComponent;
  let fixture: ComponentFixture<TrainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainersComponent, FormsModule, BrowserAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with trainers', () => {
    expect(component.trainers.length).toBeGreaterThan(0);
    expect(component.filteredTrainers.length).toBeGreaterThan(0);
  });

  it('should have featured trainer', () => {
    expect(component.featuredTrainer).toBeTruthy();
  });

  it('should filter trainers by specialization', () => {
    component.setActiveSpecialization('Yoga');
    expect(component.activeSpecialization).toBe('Yoga');
    expect(component.filteredTrainers.some(t => 
      t.specialization.includes('Yoga')
    )).toBeTruthy();
  });

  it('should filter trainers by search term', () => {
    component.searchTerm = 'Sarah';
    component.filterTrainers();
    expect(component.filteredTrainers.length).toBeGreaterThan(0);
    expect(component.filteredTrainers[0].firstName).toContain('Sarah');
  });

  it('should get correct button class for active specialization', () => {
    component.activeSpecialization = 'Yoga';
    const buttonClass = component.getSpecializationButtonClass('Yoga');
    expect(buttonClass).toContain('bg-blue-600 text-white');
  });

  it('should get correct button class for inactive specialization', () => {
    component.activeSpecialization = 'Yoga';
    const buttonClass = component.getSpecializationButtonClass('HIIT');
    expect(buttonClass).toContain('bg-gray-100 text-gray-700');
  });
});
