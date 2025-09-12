export interface Program {
  _id: string;
  title: string;
  description: string;
  trainer: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  category: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'rehabilitation' | 'weight-loss';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in weeks
  price: number;
  currency: string;
  image?: string;
  features: string[];
  schedule: {
    day: string;
    exercises: string[];
    duration: number;
  }[];
  equipmentNeeded: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'plyometric';
  description: string;
  duration?: number; // in minutes
  sets?: number;
  reps?: number;
  weight?: number;
  restTime?: number; // in seconds
  instructions: string[];
  tips?: string[];
  image?: string;
  video?: string;
}

export interface ExercisePlan {
  _id: string;
  title: string;
  description: string;
  trainer: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  category: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'rehabilitation' | 'weight-loss';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  exercises: Exercise[];
  equipmentNeeded: string[];
  targetMuscles: string[];
  caloriesBurned?: number;
  image?: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProgramRequest {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  price: number;
  features: string[];
  schedule: {
    day: string;
    exercises: string[];
    duration: number;
  }[];
  equipmentNeeded: string[];
  tags: string[];
}
