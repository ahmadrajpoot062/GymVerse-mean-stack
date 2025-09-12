import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProgramService } from '../../services/program.service';
import { ReferralService } from '../../services/referral.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: any = null;
  stats = {
    enrolledPrograms: 0,
    completedWorkouts: 0,
    totalCredits: 0,
    referralEarnings: 0
  };
  recentPrograms: any[] = [];
  referralStats: any = null;
  loading = true;

  constructor(
    private authService: AuthService,
    private programService: ProgramService,
    private referralService: ReferralService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Get current user
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.stats.totalCredits = user.credits || 0;
      },
      error: (error) => console.error('Error loading user:', error)
    });

    // Get user's programs
    this.programService.getMyPrograms().subscribe({
      next: (response: any) => {
        this.recentPrograms = response.data || [];
        this.stats.enrolledPrograms = this.recentPrograms.length;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading programs:', error);
        this.loading = false;
      }
    });

    // Get referral stats
    this.referralService.getReferralStats().subscribe({
      next: (response) => {
        this.referralStats = response.data;
        this.stats.referralEarnings = response.data.totalEarnings || 0;
      },
      error: (error) => console.error('Error loading referral stats:', error)
    });
  }

  generateReferralCode() {
    this.referralService.generateReferralCode().subscribe({
      next: (response) => {
        this.loadDashboardData(); // Refresh data
      },
      error: (error) => console.error('Error generating referral code:', error)
    });
  }
}
