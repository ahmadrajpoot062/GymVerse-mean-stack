import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
  description?: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('400ms {{ delay }} ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition(':enter', [
        query(':scope > *', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(50, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class GalleryComponent implements OnInit {
  activeFilter = 'All';
  lightboxOpen = false;
  currentImage: GalleryImage | null = null;
  currentImageIndex = 0;
  displayedImageCount = 16;
  
  categories = ['All', 'Equipment', 'Classes', 'Facilities', 'Members', 'Events'];

  allImages: GalleryImage[] = [
    // Equipment
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
      alt: 'Weight Training Area',
      category: 'Equipment',
      title: 'Premium Weight Equipment',
      description: 'State-of-the-art weight training equipment for all fitness levels'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      alt: 'Cardio Machines',
      category: 'Equipment',
      title: 'Cardio Zone',
      description: 'Modern cardio equipment with entertainment systems'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop',
      alt: 'Free Weights',
      category: 'Equipment',
      title: 'Free Weight Section',
      description: 'Complete range of dumbbells and barbells'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop',
      alt: 'Functional Training',
      category: 'Equipment',
      title: 'Functional Training Area',
      description: 'Versatile equipment for functional fitness training'
    },

    // Classes
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      alt: 'Yoga Class',
      category: 'Classes',
      title: 'Yoga Sessions',
      description: 'Peaceful yoga classes for mind and body wellness'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
      alt: 'HIIT Training',
      category: 'Classes',
      title: 'HIIT Workouts',
      description: 'High-intensity interval training for maximum results'
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop',
      alt: 'Spin Class',
      category: 'Classes',
      title: 'Spin Classes',
      description: 'Energetic cycling classes with motivating music'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
      alt: 'Boxing Training',
      category: 'Classes',
      title: 'Boxing Fitness',
      description: 'Boxing-inspired fitness classes for strength and cardio'
    },

    // Facilities
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
      alt: 'Locker Room',
      category: 'Facilities',
      title: 'Premium Locker Rooms',
      description: 'Clean and spacious locker rooms with modern amenities'
    },
    {
      id: 10,
      src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
      alt: 'Swimming Pool',
      category: 'Facilities',
      title: 'Indoor Pool',
      description: 'Olympic-size swimming pool for aquatic fitness'
    },
    {
      id: 11,
      src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
      alt: 'Juice Bar',
      category: 'Facilities',
      title: 'Nutrition Bar',
      description: 'Fresh smoothies and healthy snacks'
    },
    {
      id: 12,
      src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop',
      alt: 'Recovery Zone',
      category: 'Facilities',
      title: 'Recovery Area',
      description: 'Dedicated space for stretching and recovery'
    },

    // Members
    {
      id: 13,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      alt: 'Training Session',
      category: 'Members',
      title: 'Personal Training',
      description: 'One-on-one training sessions with certified trainers'
    },
    {
      id: 14,
      src: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop',
      alt: 'Group Workout',
      category: 'Members',
      title: 'Group Fitness',
      description: 'Members enjoying group workout sessions'
    },
    {
      id: 15,
      src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
      alt: 'Success Story',
      category: 'Members',
      title: 'Transformation Journey',
      description: 'Celebrating member success stories'
    },
    {
      id: 16,
      src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop',
      alt: 'Community',
      category: 'Members',
      title: 'Fitness Community',
      description: 'Building lasting friendships through fitness'
    },

    // Events
    {
      id: 17,
      src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
      alt: 'Fitness Challenge',
      category: 'Events',
      title: 'Monthly Challenge',
      description: 'Exciting fitness challenges for all members'
    },
    {
      id: 18,
      src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop',
      alt: 'Open House',
      category: 'Events',
      title: 'Community Open House',
      description: 'Meet new members and explore the facilities'
    },
    {
      id: 19,
      src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
      alt: 'Seminar',
      category: 'Events',
      title: 'Nutrition Seminar',
      description: 'Educational workshops on health and nutrition'
    },
    {
      id: 20,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      alt: 'Competition',
      category: 'Events',
      title: 'Fitness Competition',
      description: 'Annual fitness competitions and awards'
    }
  ];

  filteredImages: GalleryImage[] = [];

  ngOnInit() {
    this.filteredImages = this.allImages.slice(0, this.displayedImageCount);
  }

  get hasMoreImages(): boolean {
    const totalFilteredImages = this.activeFilter === 'All' 
      ? this.allImages.length 
      : this.allImages.filter(img => img.category === this.activeFilter).length;
    return this.filteredImages.length < totalFilteredImages;
  }

  setActiveFilter(category: string) {
    this.activeFilter = category;
    this.displayedImageCount = 16;
    
    if (category === 'All') {
      this.filteredImages = this.allImages.slice(0, this.displayedImageCount);
    } else {
      const categoryImages = this.allImages.filter(img => img.category === category);
      this.filteredImages = categoryImages.slice(0, this.displayedImageCount);
    }
  }

  getFilterButtonClass(category: string): string {
    const baseClasses = 'px-6 py-3 rounded-full font-medium transition-all hover:scale-105';
    if (category === this.activeFilter) {
      return `${baseClasses} bg-red-600 text-white shadow-lg`;
    }
    return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  }

  loadMoreImages() {
    this.displayedImageCount += 8;
    
    if (this.activeFilter === 'All') {
      this.filteredImages = this.allImages.slice(0, this.displayedImageCount);
    } else {
      const categoryImages = this.allImages.filter(img => img.category === this.activeFilter);
      this.filteredImages = categoryImages.slice(0, this.displayedImageCount);
    }
  }

  openLightbox(image: GalleryImage, index: number) {
    this.currentImage = image;
    this.currentImageIndex = index;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxOpen = false;
    this.currentImage = null;
    document.body.style.overflow = 'auto';
  }

  nextImage(event: Event) {
    event.stopPropagation();
    if (this.currentImageIndex < this.filteredImages.length - 1) {
      this.currentImageIndex++;
      this.currentImage = this.filteredImages[this.currentImageIndex];
    }
  }

  previousImage(event: Event) {
    event.stopPropagation();
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentImage = this.filteredImages[this.currentImageIndex];
    }
  }
}
