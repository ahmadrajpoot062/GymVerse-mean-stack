import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  /**
   * Scrolls to the top of the page with smooth animation
   */
  scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: behavior
    });
  }

  /**
   * Scrolls to a specific element by ID
   */
  scrollToElement(elementId: string, behavior: ScrollBehavior = 'smooth'): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: behavior,
        block: 'start',
        inline: 'nearest'
      });
    }
  }

  /**
   * Scrolls to a specific position
   */
  scrollToPosition(top: number, left: number = 0, behavior: ScrollBehavior = 'smooth'): void {
    window.scrollTo({
      top: top,
      left: left,
      behavior: behavior
    });
  }

  /**
   * Gets the current scroll position
   */
  getCurrentScrollPosition(): { top: number; left: number } {
    return {
      top: window.pageYOffset || document.documentElement.scrollTop,
      left: window.pageXOffset || document.documentElement.scrollLeft
    };
  }

  /**
   * Checks if the user has scrolled past a certain threshold
   */
  hasScrolledPast(threshold: number): boolean {
    return this.getCurrentScrollPosition().top > threshold;
  }
}
