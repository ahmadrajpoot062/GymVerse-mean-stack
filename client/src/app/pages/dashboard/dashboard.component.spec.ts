import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { ProgramService } from '../../services/program.service';
import { ReferralService } from '../../services/referral.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const programServiceSpy = jasmine.createSpyObj('ProgramService', ['getUserPrograms']);
    const referralServiceSpy = jasmine.createSpyObj('ReferralService', ['getUserReferrals']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ProgramService, useValue: programServiceSpy },
        { provide: ReferralService, useValue: referralServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
