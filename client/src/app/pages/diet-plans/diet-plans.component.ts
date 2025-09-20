import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface Meal {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  image: string;
}

interface DietPlan {
  id: number;
  title: string;
  description: string;
  goal: 'Weight Loss' | 'Weight Gain' | 'Maintenance' | 'Muscle Building';
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: Meal[];
  image: string;
  rating: number;
  followersCount: number;
  nutritionist: {
    name: string;
    avatar: string;
    credentials: string;
  };
}

@Component({
  selector: 'app-diet-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diet-plans.component.html',
  styleUrl: './diet-plans.component.scss',
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
export class DietPlansComponent implements OnInit {
  activeGoal = 'All';
  selectedDifficulty = 'All';
  selectedCalorieRange = 'All';
  searchTerm = '';
  filteredPlans: DietPlan[] = [];

  goals = ['All', 'Weight Loss', 'Weight Gain', 'Maintenance', 'Muscle Building'];

  dietPlans: DietPlan[] = [
    {
      id: 1,
      title: 'Mediterranean Fat Loss',
      description: 'A heart-healthy Mediterranean diet plan designed for sustainable weight loss while enjoying delicious, whole foods.',
      goal: 'Weight Loss',
      duration: '8 weeks',
      difficulty: 'Easy',
      totalCalories: 1500,
      macros: { protein: 120, carbs: 150, fat: 65 },
      rating: 4.8,
      followersCount: 2143,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
      nutritionist: {
        name: 'Dr. Maria Santos',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face',
        credentials: 'RD, PhD'
      },
      meals: []
    },
    {
      id: 2,
      title: 'High-Protein Muscle Builder',
      description: 'Optimize muscle growth with this high-protein diet plan featuring lean meats, complex carbs, and essential nutrients.',
      goal: 'Muscle Building',
      duration: '12 weeks',
      difficulty: 'Moderate',
      totalCalories: 2400,
      macros: { protein: 200, carbs: 280, fat: 80 },
      rating: 4.9,
      followersCount: 1876,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
      nutritionist: {
        name: 'Marcus Johnson',
        avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=50&h=50&fit=crop&crop=face',
        credentials: 'MS, CSCS'
      },
      meals: []
    },
    {
      id: 3,
      title: 'Plant-Based Power',
      description: 'Complete plant-based nutrition plan that provides all essential nutrients while supporting your fitness goals.',
      goal: 'Maintenance',
      duration: '6 weeks',
      difficulty: 'Moderate',
      totalCalories: 1800,
      macros: { protein: 100, carbs: 220, fat: 60 },
      rating: 4.7,
      followersCount: 1432,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      nutritionist: {
        name: 'Sarah Green',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face',
        credentials: 'RD, CDE'
      },
      meals: []
    },
    {
      id: 4,
      title: 'Keto Fat Burning',
      description: 'Low-carb, high-fat ketogenic diet plan designed to accelerate fat loss and improve metabolic health.',
      goal: 'Weight Loss',
      duration: '10 weeks',
      difficulty: 'Challenging',
      totalCalories: 1400,
      macros: { protein: 105, carbs: 35, fat: 110 },
      rating: 4.6,
      followersCount: 987,
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop',
      nutritionist: {
        name: 'Dr. Kevin Hart',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        credentials: 'MD, PhD'
      },
      meals: []
    },
    {
      id: 5,
      title: 'Lean Bulk Program',
      description: 'Carefully calibrated nutrition plan for clean weight gain, maximizing muscle growth while minimizing fat gain.',
      goal: 'Weight Gain',
      duration: '16 weeks',
      difficulty: 'Moderate',
      totalCalories: 2800,
      macros: { protein: 210, carbs: 350, fat: 90 },
      rating: 4.8,
      followersCount: 756,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      nutritionist: {
        name: 'Alex Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        credentials: 'MS, RD'
      },
      meals: []
    },
    {
      id: 6,
      title: 'Balanced Maintenance',
      description: 'Sustainable nutrition plan for maintaining your current weight while supporting an active lifestyle.',
      goal: 'Maintenance',
      duration: 'Ongoing',
      difficulty: 'Easy',
      totalCalories: 2000,
      macros: { protein: 150, carbs: 225, fat: 75 },
      rating: 4.5,
      followersCount: 1234,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      nutritionist: {
        name: 'Lisa Chen',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        credentials: 'RD, CNC'
      },
      meals: []
    }
  ];

  featuredMeal: Meal = {
    id: 1,
    name: 'Grilled Salmon with Quinoa Bowl',
    calories: 520,
    protein: 35,
    carbs: 45,
    fat: 18,
    prepTime: '25 mins',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop',
    ingredients: [
      '6 oz salmon fillet',
      '1 cup cooked quinoa',
      '1 cup mixed vegetables (broccoli, bell peppers)',
      '2 tbsp olive oil',
      '1 lemon (juiced)',
      'Salt and pepper to taste',
      'Fresh herbs (dill, parsley)'
    ],
    instructions: [
      'Season salmon with salt, pepper, and lemon juice',
      'Heat olive oil in a pan over medium-high heat',
      'Cook salmon for 4-5 minutes per side until flaky',
      'Steam mixed vegetables until tender-crisp',
      'Prepare quinoa according to package instructions',
      'Assemble bowl with quinoa, vegetables, and salmon',
      'Garnish with fresh herbs and serve immediately'
    ]
  };

  nutritionTips = [
    {
      icon: 'fas fa-tint',
      title: 'Stay Hydrated',
      description: 'Drink at least 8-10 glasses of water daily to support metabolism, reduce hunger, and improve performance.'
    },
    {
      icon: 'fas fa-clock',
      title: 'Meal Timing',
      description: 'Eat protein within 30 minutes post-workout to maximize muscle protein synthesis and recovery.'
    },
    {
      icon: 'fas fa-leaf',
      title: 'Eat Your Greens',
      description: 'Include 2-3 servings of leafy greens daily for essential vitamins, minerals, and antioxidants.'
    },
    {
      icon: 'fas fa-balance-scale',
      title: 'Portion Control',
      description: 'Use the plate method: 1/2 vegetables, 1/4 protein, 1/4 complex carbs for balanced nutrition.'
    },
    {
      icon: 'fas fa-ban',
      title: 'Limit Processed Foods',
      description: 'Choose whole, unprocessed foods 80% of the time for better nutrient density and health outcomes.'
    },
    {
      icon: 'fas fa-moon',
      title: 'Prep for Success',
      description: 'Meal prep 2-3 times per week to ensure you always have healthy options available.'
    }
  ];

  ngOnInit() {
    this.filteredPlans = [...this.dietPlans];
  }

  setActiveGoal(goal: string) {
    this.activeGoal = goal;
    this.filterPlans();
  }

  getGoalButtonClass(goal: string): string {
    const baseClasses = 'px-4 py-2 rounded-full text-sm font-medium transition-all';
    if (goal === this.activeGoal) {
      return `${baseClasses} bg-green-600 text-white`;
    }
    return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  }

  getGoalBadgeClass(goal: string): string {
    switch (goal) {
      case 'Weight Loss':
        return 'bg-red-100 text-red-800';
      case 'Weight Gain':
        return 'bg-blue-100 text-blue-800';
      case 'Muscle Building':
        return 'bg-purple-100 text-purple-800';
      case 'Maintenance':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  filterPlans() {
    this.filteredPlans = this.dietPlans.filter(plan => {
      const matchesGoal = this.activeGoal === 'All' || plan.goal === this.activeGoal;
      const matchesDifficulty = this.selectedDifficulty === 'All' || plan.difficulty === this.selectedDifficulty;
      
      let matchesCalories = true;
      if (this.selectedCalorieRange !== 'All') {
        const calories = plan.totalCalories;
        switch (this.selectedCalorieRange) {
          case '1200-1500':
            matchesCalories = calories >= 1200 && calories <= 1500;
            break;
          case '1500-1800':
            matchesCalories = calories >= 1500 && calories <= 1800;
            break;
          case '1800-2200':
            matchesCalories = calories >= 1800 && calories <= 2200;
            break;
          case '2200+':
            matchesCalories = calories >= 2200;
            break;
        }
      }

      const matchesSearch = !this.searchTerm || 
        plan.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesGoal && matchesDifficulty && matchesCalories && matchesSearch;
    });
  }

  selectPlan(plan: DietPlan) {
    // Simulate plan selection
    alert(`You've selected "${plan.title}". This would normally navigate to the detailed plan view with meal plans and shopping lists.`);
    // In a real app, this would navigate to plan details
    // this.router.navigate(['/diet-plans', plan.id]);
  }
}
