import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface Trainer {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  bio: string;
  profilePicture: string;
  certifications: string[];
  location: string;
  availability: string[];
  languages: string[];
  isOnline: boolean;
  featured?: boolean;
}

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainers.component.html',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition(':enter', [
        query(':scope > *', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class TrainersComponent implements OnInit {
  activeSpecialization = 'All';
  selectedExperience = 'All';
  selectedPriceRange = 'All';
  onlineOnly = false;
  searchTerm = '';
  filteredTrainers: Trainer[] = [];

  specializations = ['All', 'Strength Training', 'Weight Loss', 'Yoga', 'HIIT', 'Nutrition', 'Rehabilitation', 'Sports Performance'];

  trainers: Trainer[] = [
    {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Johnson',
      specialization: ['Strength Training', 'Weight Loss', 'Nutrition'],
      experience: 8,
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 75,
      bio: 'Certified personal trainer with over 8 years of experience helping clients achieve their fitness goals. Specializes in strength training and sustainable weight loss through proper nutrition and exercise.',
      profilePicture: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=face',
      certifications: ['NASM-CPT', 'Precision Nutrition', 'TRX Certified'],
      location: 'New York, NY',
      availability: ['Morning', 'Evening'],
      languages: ['English', 'Spanish'],
      isOnline: true,
      featured: true
    },
    {
      id: 2,
      firstName: 'Mike',
      lastName: 'Chen',
      specialization: ['HIIT', 'Sports Performance', 'Strength Training'],
      experience: 6,
      rating: 4.8,
      reviewCount: 93,
      hourlyRate: 65,
      bio: 'Former collegiate athlete turned personal trainer. Passionate about high-intensity training and helping athletes reach peak performance. Known for challenging yet supportive training style.',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      certifications: ['ACSM-CPT', 'CSCS', 'FMS Level 2'],
      location: 'Los Angeles, CA',
      availability: ['Morning', 'Afternoon'],
      languages: ['English', 'Mandarin'],
      isOnline: true
    },
    {
      id: 3,
      firstName: 'Emily',
      lastName: 'Rodriguez',
      specialization: ['Yoga', 'Pilates', 'Flexibility'],
      experience: 5,
      rating: 4.9,
      reviewCount: 156,
      hourlyRate: 55,
      bio: 'Yoga instructor and movement specialist focused on improving flexibility, balance, and mindfulness. Creates peaceful, inclusive environments for practitioners of all levels.',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      certifications: ['RYT-500', 'Pilates Comprehensive', 'Meditation Teacher'],
      location: 'Austin, TX',
      availability: ['Morning', 'Evening'],
      languages: ['English'],
      isOnline: true
    },
    {
      id: 4,
      firstName: 'David',
      lastName: 'Thompson',
      specialization: ['Rehabilitation', 'Injury Prevention', 'Senior Fitness'],
      experience: 12,
      rating: 4.7,
      reviewCount: 89,
      hourlyRate: 85,
      bio: 'Physical therapy assistant and certified trainer specializing in injury rehabilitation and prevention. Expert in helping clients return to activity safely after injury.',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      certifications: ['NASM-CES', 'PTA License', 'Senior Fitness Specialist'],
      location: 'Chicago, IL',
      availability: ['Afternoon', 'Evening'],
      languages: ['English'],
      isOnline: false
    },
    {
      id: 5,
      firstName: 'Lisa',
      lastName: 'Kim',
      specialization: ['Nutrition', 'Weight Loss', 'Meal Planning'],
      experience: 4,
      rating: 4.8,
      reviewCount: 112,
      hourlyRate: 60,
      bio: 'Registered dietitian and fitness coach who takes a holistic approach to health. Specializes in creating sustainable nutrition plans that complement your fitness routine.',
      profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      certifications: ['RD', 'NASM-CPT', 'Intuitive Eating Counselor'],
      location: 'Seattle, WA',
      availability: ['Morning', 'Afternoon'],
      languages: ['English', 'Korean'],
      isOnline: true
    },
    {
      id: 6,
      firstName: 'Marcus',
      lastName: 'Williams',
      specialization: ['Powerlifting', 'Strength Training', 'Sports Performance'],
      experience: 10,
      rating: 4.9,
      reviewCount: 203,
      hourlyRate: 90,
      bio: 'Competitive powerlifter and strength coach. Helps clients build serious strength through proper lifting technique and progressive programming. Known for getting results.',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      certifications: ['USAPL Certified', 'NSCA-CSCS', 'Starting Strength Coach'],
      location: 'Miami, FL',
      availability: ['Morning', 'Evening'],
      languages: ['English'],
      isOnline: true
    }
  ];

  featuredTrainer: Trainer | null = null;

  trainerBenefits = [
    {
      icon: 'fas fa-certificate',
      title: 'Certified Professionals',
      description: 'All trainers hold recognized certifications and undergo continuous education'
    },
    {
      icon: 'fas fa-clock',
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit your schedule with morning, afternoon, and evening options'
    },
    {
      icon: 'fas fa-laptop',
      title: 'Online & In-Person',
      description: 'Choose between virtual sessions or meet in person at our facilities'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Progress Tracking',
      description: 'Monitor your improvements with detailed progress reports and assessments'
    }
  ];

  ngOnInit() {
    this.filteredTrainers = [...this.trainers];
    this.featuredTrainer = this.trainers.find(t => t.featured) || this.trainers[0];
  }

  setActiveSpecialization(specialization: string) {
    this.activeSpecialization = specialization;
    this.filterTrainers();
  }

  getSpecializationButtonClass(specialization: string): string {
    const baseClasses = 'px-4 py-2 rounded-full text-sm font-medium transition-all';
    if (specialization === this.activeSpecialization) {
      return `${baseClasses} bg-blue-600 text-white`;
    }
    return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  }

  filterTrainers() {
    this.filteredTrainers = this.trainers.filter(trainer => {
      const matchesSpecialization = this.activeSpecialization === 'All' || 
        trainer.specialization.some(spec => spec.includes(this.activeSpecialization));
      
      let matchesExperience = true;
      if (this.selectedExperience !== 'All') {
        const exp = trainer.experience;
        switch (this.selectedExperience) {
          case '1-3':
            matchesExperience = exp >= 1 && exp <= 3;
            break;
          case '3-5':
            matchesExperience = exp > 3 && exp <= 5;
            break;
          case '5+':
            matchesExperience = exp > 5;
            break;
        }
      }
      
      let matchesPrice = true;
      if (this.selectedPriceRange !== 'All') {
        const rate = trainer.hourlyRate;
        switch (this.selectedPriceRange) {
          case '25-50':
            matchesPrice = rate >= 25 && rate <= 50;
            break;
          case '50-75':
            matchesPrice = rate > 50 && rate <= 75;
            break;
          case '75-100':
            matchesPrice = rate > 75 && rate <= 100;
            break;
          case '100+':
            matchesPrice = rate > 100;
            break;
        }
      }

      const matchesOnline = !this.onlineOnly || trainer.isOnline;

      const matchesSearch = !this.searchTerm || 
        `${trainer.firstName} ${trainer.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        trainer.specialization.some(spec => spec.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        trainer.bio.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesSpecialization && matchesExperience && matchesPrice && matchesOnline && matchesSearch;
    });
  }

  viewProfile(trainer: Trainer) {
    // Simulate profile view
    alert(`Viewing profile for ${trainer.firstName} ${trainer.lastName}. This would normally navigate to a detailed trainer profile page with reviews, video introductions, and booking calendar.`);
    // In a real app, this would navigate to trainer profile
    // this.router.navigate(['/trainers', trainer.id]);
  }

  contactTrainer(trainer: Trainer) {
    // Simulate contacting trainer
    alert(`Contacting ${trainer.firstName} ${trainer.lastName}. This would normally open a messaging interface or booking form to schedule a consultation.`);
    // In a real app, this would open a contact/booking form
  }
}
