export interface Trainer {
  _id: string;
  user: string;
  name: string;
  email: string;
  profileImage?: string;
  bio: string;
  specialization: string[];
  experience: number;
  certification: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  location: {
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainerReview {
  _id: string;
  trainer: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface CreateTrainerRequest {
  bio: string;
  specialization: string[];
  experience: number;
  certification: string[];
  hourlyRate: number;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  location: {
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}
