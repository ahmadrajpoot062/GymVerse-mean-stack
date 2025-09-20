import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  autoClose: boolean;
  duration?: number;
  timeoutId?: number; // Store the timeout ID to allow cancellation
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  private lastId = 0;
  
  toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();
  
  constructor() {}
  
  // Show a success toast
  success(message: string, autoClose = true, duration = 3000): number {
    return this.show(message, 'success', autoClose, duration);
  }
  
  // Show an error toast
  error(message: string, autoClose = true, duration = 4000): number {
    return this.show(message, 'error', autoClose, duration);
  }
  
  // Show an info toast
  info(message: string, autoClose = true, duration = 2000): number {
    return this.show(message, 'info', autoClose, duration);
  }
  
  // Show a warning toast
  warning(message: string, autoClose = true, duration = 3000): number {
    return this.show(message, 'warning', autoClose, duration);
  }
  
  // Show a toast message
  private show(message: string, type: 'success' | 'error' | 'info' | 'warning', autoClose: boolean, duration?: number): number {
    const id = ++this.lastId;
    
    let timeoutId: number | undefined;
    if (autoClose && duration) {
      timeoutId = window.setTimeout(() => this.remove(id), duration) as unknown as number;
    }
    
    const toast: Toast = {
      id,
      message,
      type,
      autoClose,
      duration,
      timeoutId
    };
    
    this.toasts = [...this.toasts, toast];
    this.toastsSubject.next(this.toasts);
    
    return id;
  }
  
  // Remove a toast by ID
  remove(id: number): void {
    const toast = this.toasts.find(t => t.id === id);
    if (toast?.timeoutId) {
      window.clearTimeout(toast.timeoutId);
    }
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(this.toasts);
  }
  
  // Pause a toast (cancel its timeout)
  pauseToast(id: number): void {
    const toast = this.toasts.find(t => t.id === id);
    if (toast?.timeoutId) {
      window.clearTimeout(toast.timeoutId);
      toast.timeoutId = undefined;
    }
  }
  
  // Resume a toast (start a new timeout)
  resumeToast(id: number, delay: number = 1000): void {
    const toast = this.toasts.find(t => t.id === id);
    if (toast && toast.autoClose) {
      // Use the original duration if available, otherwise use the provided delay
      const duration = toast.duration || delay;
      // Clear any existing timeout first
      if (toast.timeoutId) {
        window.clearTimeout(toast.timeoutId);
      }
      // Start a new timeout
      toast.timeoutId = window.setTimeout(() => this.remove(id), duration) as unknown as number;
    }
  }
  
  // Clear all toasts
  clear(): void {
    this.toasts = [];
    this.toastsSubject.next(this.toasts);
  }
}
