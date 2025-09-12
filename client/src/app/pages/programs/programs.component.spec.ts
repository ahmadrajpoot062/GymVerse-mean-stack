import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { ProgramsComponent } from './programs.component';

describe('ProgramsComponent', () => {
  let component: ProgramsComponent;
  let fixture: ComponentFixture<ProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramsComponent, NoopAnimationsModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with all programs', () => {
    expect(component.filteredPrograms.length).toBeGreaterThan(0);
    expect(component.filteredPrograms.length).toBe(component.programs.length);
  });

  it('should filter programs by type', () => {
    component.setActiveType('Strength');
    expect(component.activeType).toBe('Strength');
    expect(component.filteredPrograms.every(p => p.type === 'Strength')).toBeTruthy();
  });

  it('should filter programs by level', () => {
    component.selectedLevel = 'Beginner';
    component.filterPrograms();
    expect(component.filteredPrograms.every(p => p.level === 'Beginner')).toBeTruthy();
  });

  it('should filter programs by price range', () => {
    component.selectedPriceRange = 'Free';
    component.filterPrograms();
    expect(component.filteredPrograms.every(p => p.price === 0)).toBeTruthy();
  });

  it('should search programs by title', () => {
    component.searchTerm = 'BEAST';
    component.filterPrograms();
    expect(component.filteredPrograms.some(p => p.title.includes('BEAST'))).toBeTruthy();
  });

  it('should set featured program on init', () => {
    expect(component.featuredProgram).toBeTruthy();
    expect(component.featuredProgram).toBe(component.programs[0]);
  });
});
