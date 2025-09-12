import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface Program {
  id: number;
  title: string;
  description: string;
  type: 'Strength' | 'Cardio' | 'HIIT' | 'Yoga' | 'Pilates' | 'Crossfit';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  price: number;
  image: string;
  rating: number;
  enrolledCount: number;
  trainer: {
    name: string;
    avatar: string;
    specialization: string;
  };
  features: string[];
  schedule?: string[];
}

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss',
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
export class ProgramsComponent implements OnInit {
  activeType = 'All';
  selectedLevel = 'All';
  selectedPriceRange = 'All';
  searchTerm = '';
  filteredPrograms: Program[] = [];

  programTypes = ['All', 'Strength', 'Cardio', 'HIIT', 'Yoga', 'Pilates', 'Crossfit'];

  programs: Program[] = [
    {
      id: 1,
      title: 'BEAST MODE: Mass Building Protocol',
      description: 'Elite muscle-building program designed by IFBB professionals. Scientifically proven methods to pack on serious mass and strength.',
      type: 'Strength',
      level: 'Advanced',
      duration: '16 weeks',
      price: 149,
      rating: 4.9,
      enrolledCount: 3240,
      image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      trainer: {
        name: 'Marcus "The Beast" Thompson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        specialization: 'IFBB Pro Bodybuilder'
      },
      features: [
        'Advanced compound movements',
        'Periodized strength cycles',
        'Elite nutrition protocols',
        'Recovery optimization',
        'Supplement guidance',
        'Weekly video check-ins'
      ],
      schedule: ['Monday: Push (Chest, Shoulders, Triceps)', 'Tuesday: Pull (Back, Biceps)', 'Wednesday: Legs & Core', 'Thursday: Push Variation', 'Friday: Pull Variation', 'Saturday: Arms & Shoulders', 'Sunday: Active Recovery']
    },
    {
      id: 2,
      title: 'SHREDDED: Ultimate Cut Program',
      description: 'Get stage-ready shredded with this intensive 12-week cutting protocol used by competitive bodybuilders.',
      type: 'HIIT',
      level: 'Advanced',
      duration: '12 weeks',
      price: 129,
      rating: 4.8,
      enrolledCount: 2890,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      trainer: {
        name: 'Victoria "Shredded" Stone',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
        specialization: 'Contest Prep Coach'
      },
      features: [
        'High-intensity fat burning',
        'Metabolic conditioning',
        'Competition diet protocols',
        'Cardio periodization',
        'Stage-ready techniques',
        'Peak week strategies'
      ],
      schedule: ['Monday: HIIT + Upper', 'Tuesday: LISS Cardio + Core', 'Wednesday: HIIT + Lower', 'Thursday: HIIT + Upper', 'Friday: LISS + Full Body', 'Saturday: HIIT + Posing', 'Sunday: Active Recovery']
    },
    {
      id: 3,
      title: 'POWERHOUSE: Strength Domination',
      description: 'Dominate the gym with this powerlifting-focused program. Build raw strength and command respect.',
      type: 'Strength',
      level: 'Intermediate',
      duration: '20 weeks',
      price: 99,
      rating: 4.9,
      enrolledCount: 1850,
      image: 'https://images.unsplash.com/photo-1583500178690-f7d24c27fa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      trainer: {
        name: 'Jake "Iron" Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        specialization: 'Powerlifting Champion'
      },
      features: [
        'Big 3 focus (Squat, Bench, Deadlift)',
        'Percentage-based programming',
        'Accessory work optimization',
        'Competition preparation',
        'Form perfection videos',
        'Strength testing protocols'
      ],
      schedule: ['Monday: Squat Focus', 'Tuesday: Bench Press Focus', 'Wednesday: Deadlift Focus', 'Thursday: Squat Accessories', 'Friday: Bench Accessories', 'Saturday: Deadlift Accessories', 'Sunday: Recovery & Mobility']
    },
    {
      id: 4,
      title: 'WARRIOR MINDSET: Mental & Physical',
      description: 'Forge an unbreakable mindset while building a warrior physique. Military-inspired training protocols.',
      type: 'Crossfit',
      level: 'Intermediate',
      duration: '8 weeks',
      price: 79,
      rating: 4.7,
      enrolledCount: 2100,
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      trainer: {
        name: 'Captain Mike "Warrior" Davis',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=50&h=50&fit=crop&crop=face',
        specialization: 'Military Fitness Expert'
      },
      features: [
        'Functional strength training',
        'Mental toughness drills',
        'Tactical fitness protocols',
        'Endurance conditioning',
        'Team-based challenges',
        'Leadership development'
      ],
      schedule: ['Monday: Strength & Power', 'Tuesday: Cardio & Agility', 'Wednesday: Functional Training', 'Thursday: HIIT & Core', 'Friday: Full Body Strength', 'Saturday: Endurance Challenge', 'Sunday: Recovery & Reflection']
    },
    {
      id: 5,
      title: 'FEMALE PHYSIQUE: Sculpted & Strong',
      description: 'Elite training designed specifically for women who want to build a strong, sculpted physique with feminine curves.',
      type: 'Strength',
      level: 'Beginner',
      duration: '10 weeks',
      price: 89,
      rating: 4.8,
      enrolledCount: 3650,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      trainer: {
        name: 'Amanda "Sculpted" Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        specialization: 'Women\'s Physique Coach'
      },
      features: [
        'Female-specific programming',
        'Glute & core emphasis',
        'Hormone-optimized training',
        'Body recomposition focus',
        'Confidence building',
        'Posture correction'
      ],
      schedule: ['Monday: Lower Body Power', 'Tuesday: Upper Body Strength', 'Wednesday: Glutes & Core', 'Thursday: Full Body Circuit', 'Friday: Lower Body Hypertrophy', 'Saturday: Upper Body Sculpting', 'Sunday: Yoga & Recovery']
    },
    {
      id: 6,
      title: 'DEMOLITION: Extreme Fat Loss',
      description: 'Demolish fat with this extreme cutting program. High-intensity protocols for rapid transformation.',
      type: 'Cardio',
      level: 'Advanced',
      duration: '6 weeks',
      price: 69,
      rating: 4.6,
      enrolledCount: 1980,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      trainer: {
        name: 'Carlos "Demolition" Martinez',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
        specialization: 'Fat Loss Specialist'
      },
      features: [
        'Extreme calorie burning',
        'Metabolic shock protocols',
        'Rapid fat loss techniques',
        'Intensive cardio circuits',
        'Emergency cut strategies',
        'Motivation & accountability'
      ],
      schedule: ['Monday: HIIT Cardio + Core', 'Tuesday: Strength + Cardio', 'Wednesday: Cardio Intervals', 'Thursday: Full Body + Cardio', 'Friday: Metabolic Circuits', 'Saturday: Long Cardio + Abs', 'Sunday: Active Recovery']
    }
  ];

  featuredProgram: Program | null = null;

  ngOnInit() {
    this.filteredPrograms = [...this.programs];
    this.featuredProgram = this.programs[0]; // Set first program as featured
  }

  setActiveType(type: string) {
    this.activeType = type;
    this.filterPrograms();
  }

  getTypeButtonClass(type: string): string {
    const baseClasses = 'px-4 py-2 rounded-full text-sm font-medium transition-all';
    if (type === this.activeType) {
      return `${baseClasses} bg-red-600 text-white`;
    }
    return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  }

  getLevelBadgeClass(level: string): string {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeBadgeClass(type: string): string {
    const colorMap: { [key: string]: string } = {
      'Strength': 'bg-blue-100 text-blue-800',
      'Cardio': 'bg-green-100 text-green-800',
      'HIIT': 'bg-red-100 text-red-800',
      'Yoga': 'bg-purple-100 text-purple-800',
      'Pilates': 'bg-pink-100 text-pink-800',
      'Crossfit': 'bg-orange-100 text-orange-800'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  }

  filterPrograms() {
    this.filteredPrograms = this.programs.filter(program => {
      const matchesType = this.activeType === 'All' || program.type === this.activeType;
      const matchesLevel = this.selectedLevel === 'All' || program.level === this.selectedLevel;
      
      let matchesPrice = true;
      if (this.selectedPriceRange !== 'All') {
        const price = program.price;
        switch (this.selectedPriceRange) {
          case 'Free':
            matchesPrice = price === 0;
            break;
          case '0-50':
            matchesPrice = price >= 0 && price <= 50;
            break;
          case '50-100':
            matchesPrice = price > 50 && price <= 100;
            break;
          case '100+':
            matchesPrice = price > 100;
            break;
        }
      }

      const matchesSearch = !this.searchTerm || 
        program.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        program.trainer.name.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesType && matchesLevel && matchesPrice && matchesSearch;
    });
  }

  selectProgram(program: Program) {
    // Simulate program selection
    alert(`You've selected "${program.title}". This would normally navigate to the detailed program view with workout schedules and progress tracking.`);
    // In a real app, this would navigate to program details
    // this.router.navigate(['/programs', program.id]);
  }

  enrollProgram(program: Program, event: Event) {
    event.stopPropagation();
    // Simulate enrollment
    if (program.price === 0) {
      alert(`You've enrolled in "${program.title}" for free! Welcome to your fitness journey.`);
    } else {
      alert(`Enrolling in "${program.title}" for $${program.price}. Redirecting to checkout...`);
    }
    // In a real app, this would handle enrollment/payment
  }

  previewProgram(program: Program) {
    // Simulate program preview
    alert(`Playing preview for "${program.title}". In a real app, this would show a video preview or detailed program overview.`);
  }
}
