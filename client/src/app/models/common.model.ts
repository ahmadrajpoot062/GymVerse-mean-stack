export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Membership {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DietPlan {
  _id: string;
  title: string;
  description: string;
  trainer: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  type: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'cutting' | 'bulking';
  goal: string;
  duration: number; // in days
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: {
    name: string;
    time: string;
    foods: {
      name: string;
      quantity: string;
      calories: number;
    }[];
    totalCalories: number;
  }[];
  dietaryRestrictions: string[];
  shoppingList: string[];
  mealPrep: {
    day: string;
    instructions: string[];
  }[];
  tips: string[];
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}
