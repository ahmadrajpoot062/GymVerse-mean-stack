import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  stats: any = {};
  users: any[] = [];
  trainers: any[] = [];
  analytics: any = {};
  loading = true;
  activeTab = 'dashboard';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load dashboard stats
    this.adminService.getDashboardStats().subscribe({
      next: (response: any) => {
        this.stats = response.data?.stats || {};
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading dashboard stats:', error);
        this.loading = false;
      }
    });

    // Load analytics
    this.adminService.getAnalytics('30d').subscribe({
      next: (response: any) => {
        this.analytics = response.data || {};
      },
      error: (error: any) => console.error('Error loading analytics:', error)
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    
    if (tab === 'users' && this.users.length === 0) {
      this.loadUsers();
    } else if (tab === 'trainers' && this.trainers.length === 0) {
      this.loadTrainers();
    }
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.data || [];
      },
      error: (error: any) => console.error('Error loading users:', error)
    });
  }

  loadTrainers(): void {
    this.adminService.getTrainers().subscribe({
      next: (response: any) => {
        this.trainers = response.data || [];
      },
      error: (error: any) => console.error('Error loading trainers:', error)
    });
  }

  approveTrainer(trainerId: string): void {
    this.adminService.approveTrainer(trainerId).subscribe({
      next: () => {
        this.loadTrainers();
      },
      error: (error: any) => console.error('Error approving trainer:', error)
    });
  }

  rejectTrainer(trainerId: string): void {
    this.adminService.rejectTrainer(trainerId).subscribe({
      next: () => {
        this.loadTrainers();
      },
      error: (error: any) => console.error('Error rejecting trainer:', error)
    });
  }
}
