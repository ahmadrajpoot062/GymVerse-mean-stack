import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with all images', () => {
    expect(component.filteredImages.length).toBeGreaterThan(0);
    expect(component.activeFilter).toBe('All');
  });

  it('should filter images by category', () => {
    component.setActiveFilter('Equipment');
    expect(component.activeFilter).toBe('Equipment');
    expect(component.filteredImages.every(img => img.category === 'Equipment')).toBeTruthy();
  });

  it('should open lightbox with correct image', () => {
    const testImage = component.allImages[0];
    component.openLightbox(testImage, 0);
    expect(component.lightboxOpen).toBe(true);
    expect(component.currentImage).toBe(testImage);
    expect(component.currentImageIndex).toBe(0);
  });

  it('should close lightbox', () => {
    component.lightboxOpen = true;
    component.closeLightbox();
    expect(component.lightboxOpen).toBe(false);
    expect(component.currentImage).toBeNull();
  });

  it('should navigate to next image', () => {
    component.openLightbox(component.filteredImages[0], 0);
    const mockEvent = { stopPropagation: jasmine.createSpy() } as any;
    component.nextImage(mockEvent);
    expect(component.currentImageIndex).toBe(1);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should navigate to previous image', () => {
    component.openLightbox(component.filteredImages[1], 1);
    const mockEvent = { stopPropagation: jasmine.createSpy() } as any;
    component.previousImage(mockEvent);
    expect(component.currentImageIndex).toBe(0);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should load more images', () => {
    const initialCount = component.filteredImages.length;
    component.loadMoreImages();
    expect(component.filteredImages.length).toBeGreaterThan(initialCount);
  });
});
