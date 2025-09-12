import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminComponent } from './admin.component';
import { AdminService } from '../../services/admin.service';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    const adminServiceSpy = jasmine.createSpyObj('AdminService', ['getStats', 'getUsers', 'getTrainers']);

    await TestBed.configureTestingModule({
      imports: [AdminComponent, RouterTestingModule],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
