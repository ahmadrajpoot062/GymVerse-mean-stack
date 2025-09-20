import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../../services/toast.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div 
          class="toast" 
          [ngClass]="{
            'success': toast.type === 'success',
            'error': toast.type === 'error',
            'info': toast.type === 'info',
            'warning': toast.type === 'warning'
          }"
          [@toastAnimation]="'visible'"
          (mouseenter)="pauseToast(toast.id)" 
          (mouseleave)="resumeToast(toast.id)"
        >
          <div class="toast-message">{{ toast.message }}</div>
          <button class="toast-close" (click)="removeToast(toast.id); $event.stopPropagation()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column-reverse;  /* Reversed so newest toasts appear at the bottom */
      gap: 0.5rem;
      max-width: 24rem;
      pointer-events: none;
    }
    
    .toast {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-radius: 0.375rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      pointer-events: auto;
      cursor: pointer;
      overflow: hidden;
      position: relative;
    }
    
    .toast::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: rgba(255, 255, 255, 0.3);
    }
    
    .toast.success {
      background-color: #10B981;
      color: white;
    }
    
    .toast.error {
      background-color: #EF4444;
      color: white;
    }
    
    .toast.info {
      background-color: #3B82F6;
      color: white;
    }
    
    .toast.warning {
      background-color: #F59E0B;
      color: white;
    }
    
    .toast-message {
      flex-grow: 1;
      font-size: 0.875rem;
      padding-left: 0.5rem;
    }
    
    .toast-close {
      margin-left: 0.75rem;
      background: transparent;
      border: none;
      color: white;
      opacity: 0.7;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .toast-close:hover {
      opacity: 1;
      background-color: rgba(255, 255, 255, 0.1);
    }
  `],
  animations: [
    trigger('toastAnimation', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => visible', animate('300ms ease-out')),
      transition('visible => void', animate('200ms ease-in'))
    ])
  ]
})
export class ToastContainerComponent implements OnInit {
  toasts: Toast[] = [];
  pausedToasts: Set<number> = new Set();

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
    this.pausedToasts.delete(id);
  }
  
  pauseToast(id: number): void {
    this.pausedToasts.add(id);
    this.toastService.pauseToast(id);
  }
  
  resumeToast(id: number): void {
    this.pausedToasts.delete(id);
    // Let the service handle duration management
    this.toastService.resumeToast(id);
  }
}
