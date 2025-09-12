import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'programs',
    loadComponent: () => import('./pages/programs/programs.component').then(m => m.ProgramsComponent)
  },
  {
    path: 'trainers',
    loadComponent: () => import('./pages/trainers/trainers.component').then(m => m.TrainersComponent)
  },
  {
    path: 'memberships',
    loadComponent: () => import('./pages/memberships/memberships.component').then(m => m.MembershipsComponent)
  },
  {
    path: 'exercise-plans',
    loadComponent: () => import('./pages/exercise-plans/exercise-plans.component').then(m => m.ExercisePlansComponent)
  },
  {
    path: 'diet-plans',
    loadComponent: () => import('./pages/diet-plans/diet-plans.component').then(m => m.DietPlansComponent)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent)
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
