import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  muscles: string[];
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  image: string;
  videoUrl?: string;
  instructions: string[];
}

interface ExercisePlan {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  exercises: Exercise[];
  image: string;
  rating: number;
  enrolledCount: number;
  trainer: {
    name: string;
    avatar: string;
  };
}

@Component({
  selector: 'app-exercise-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exercise-plans.component.html',
  styleUrl: './exercise-plans.component.scss',
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
export class ExercisePlansComponent implements OnInit {
  activeCategory = 'All';
  selectedDifficulty = 'All';
  searchTerm = '';
  filteredPlans: ExercisePlan[] = [];

  categories = ['All', 'Strength', 'Cardio', 'Flexibility', 'HIIT', 'Bodyweight', 'Powerlifting'];

  exercisePlans: ExercisePlan[] = [
    {
      id: 1,
      title: 'Full Body Strength Builder',
      description: 'A comprehensive strength training program designed to build muscle and increase overall power. Perfect for beginners to intermediate fitness enthusiasts.',
      duration: '6 weeks',
      difficulty: 'Intermediate',
      category: 'Strength',
      rating: 4.8,
      enrolledCount: 1234,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      trainer: {
        name: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
      },
      exercises: []
    },
    {
      id: 2,
      title: 'HIIT Fat Burner',
      description: 'High-intensity interval training designed to maximize fat burn and improve cardiovascular health in minimal time.',
      duration: '4 weeks',
      difficulty: 'Advanced',
      category: 'HIIT',
      rating: 4.9,
      enrolledCount: 856,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      trainer: {
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
      },
      exercises: []
    },
    {
      id: 3,
      title: 'Beginner Bodyweight',
      description: 'Start your fitness journey with this beginner-friendly bodyweight routine. No equipment needed, just your determination.',
      duration: '8 weeks',
      difficulty: 'Beginner',
      category: 'Bodyweight',
      rating: 4.6,
      enrolledCount: 2156,
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
      trainer: {
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face'
      },
      exercises: []
    },
    {
      id: 4,
      title: 'Cardio Kickstart',
      description: 'Energizing cardio workouts to boost your endurance and get your heart pumping. Perfect for all fitness levels.',
      duration: '5 weeks',
      difficulty: 'Beginner',
      category: 'Cardio',
      rating: 4.7,
      enrolledCount: 967,
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop',
      trainer: {
        name: 'Lisa Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
      },
      exercises: []
    },
    {
      id: 5,
      title: 'Flexibility & Mobility',
      description: 'Improve your range of motion and prevent injuries with this comprehensive flexibility and mobility program.',
      duration: '6 weeks',
      difficulty: 'Beginner',
      category: 'Flexibility',
      rating: 4.5,
      enrolledCount: 743,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      trainer: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
      },
      exercises: []
    },
    {
      id: 6,
      title: 'Powerlifting Basics',
      description: 'Master the fundamentals of powerlifting with proper form and progressive overload techniques.',
      duration: '12 weeks',
      difficulty: 'Advanced',
      category: 'Powerlifting',
      rating: 4.9,
      enrolledCount: 445,
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop',
      trainer: {
        name: 'Marcus Thompson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
      },
      exercises: []
    }
  ];

  featuredExercise: Exercise = {
    id: 1,
    name: 'Deadlift',
    sets: 3,
    reps: '8-10',
    rest: '2-3 min',
    muscles: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    description: 'The deadlift is one of the most effective compound exercises for building overall strength and muscle mass.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    videoUrl: 'https://example.com/deadlift-video',
    instructions: [
      'Stand with your feet hip-width apart, toes pointing forward',
      'Bend at the hips and knees to lower your body and grasp the barbell',
      'Keep your back straight and chest up throughout the movement',
      'Drive through your heels to lift the bar, extending your hips and knees',
      'Stand tall at the top, then slowly lower the bar back to the starting position'
    ]
  };

  ngOnInit() {
    this.filteredPlans = [...this.exercisePlans];
  }

  setActiveCategory(category: string) {
    this.activeCategory = category;
    this.filterPlans();
  }

  getCategoryButtonClass(category: string): string {
    const baseClasses = 'px-4 py-2 rounded-full text-sm font-medium transition-all';
    if (category === this.activeCategory) {
      return `${baseClasses} bg-red-600 text-white`;
    }
    return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  }

  getDifficultyBadgeClass(difficulty: string): string {
    switch (difficulty) {
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

  filterPlans() {
    this.filteredPlans = this.exercisePlans.filter(plan => {
      const matchesCategory = this.activeCategory === 'All' || plan.category === this.activeCategory;
      const matchesDifficulty = this.selectedDifficulty === 'All' || plan.difficulty === this.selectedDifficulty;
      const matchesSearch = !this.searchTerm || 
        plan.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }

  selectPlan(plan: ExercisePlan) {
    // Simulate plan selection
    alert(`You've selected "${plan.title}". This would normally navigate to the detailed plan view with exercises and progress tracking.`);
    // In a real app, this would navigate to plan details
    // this.router.navigate(['/exercise-plans', plan.id]);
  }

  playExerciseVideo(exercise: Exercise) {
    // Simulate video playback
    alert(`Playing instructional video for ${exercise.name}. In a real app, this would open a video player or modal.`);
    // In a real app, this would open a video player
  }
}
