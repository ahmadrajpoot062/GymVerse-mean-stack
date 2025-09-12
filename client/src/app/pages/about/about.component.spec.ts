import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have values array', () => {
    expect(component.values.length).toBeGreaterThan(0);
    expect(component.values[0].title).toBeDefined();
    expect(component.values[0].description).toBeDefined();
    expect(component.values[0].icon).toBeDefined();
  });

  it('should have timeline array', () => {
    expect(component.timeline.length).toBeGreaterThan(0);
    expect(component.timeline[0].year).toBeDefined();
    expect(component.timeline[0].title).toBeDefined();
    expect(component.timeline[0].description).toBeDefined();
  });

  it('should have team array', () => {
    expect(component.team.length).toBeGreaterThan(0);
    expect(component.team[0].name).toBeDefined();
    expect(component.team[0].position).toBeDefined();
    expect(component.team[0].bio).toBeDefined();
    expect(component.team[0].image).toBeDefined();
  });

  it('should have stats array', () => {
    expect(component.stats.length).toBeGreaterThan(0);
    expect(component.stats[0].value).toBeDefined();
    expect(component.stats[0].label).toBeDefined();
  });
});
