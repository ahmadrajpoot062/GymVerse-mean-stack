import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MusicControlComponent } from './components/music-control/music-control.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { ScrollService } from './services/scroll.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, MusicControlComponent, ToastContainerComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <app-header></app-header>
      
      <!-- Global Music Control -->
      <app-music-control></app-music-control>
      
      <!-- Main Content -->
      <main class="flex-1 pt-20">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <app-footer></app-footer>
      
      <!-- Toast Container -->
      <app-toast-container></app-toast-container>
    </div>
  `,
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  title = 'GymVerse - Train Hard, Live Strong';
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router, 
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    // Scroll to top on route change
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Use scroll service for consistent behavior
        this.scrollService.scrollToTop('auto');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
