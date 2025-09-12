/**
 * Program Model for GymVerse
 * Training programs offered by trainers
 */

const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Program title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Program description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters'],
  },
  
  // Program Classification
  category: {
    type: String,
    required: [true, 'Program category is required'],
    enum: [
      'strength-training',
      'cardio-fitness',
      'weight-loss',
      'muscle-building',
      'crossfit',
      'yoga',
      'pilates',
      'hiit',
      'bodybuilding',
      'powerlifting',
      'functional-training',
      'flexibility',
      'sports-specific',
      'rehabilitation',
      'dance-fitness',
      'martial-arts',
      'senior-fitness',
      'youth-fitness',
      'prenatal-fitness'
    ],
  },
  
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  
  // Trainer Information
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  
  // Program Details
  duration: {
    weeks: {
      type: Number,
      required: [true, 'Program duration in weeks is required'],
      min: [1, 'Duration must be at least 1 week'],
      max: [52, 'Duration cannot exceed 52 weeks'],
    },
    sessionsPerWeek: {
      type: Number,
      required: [true, 'Sessions per week is required'],
      min: [1, 'Must have at least 1 session per week'],
      max: [7, 'Cannot exceed 7 sessions per week'],
    },
    sessionDuration: {
      type: Number,
      required: [true, 'Session duration is required'],
      min: [15, 'Session must be at least 15 minutes'],
      max: [180, 'Session cannot exceed 180 minutes'],
    },
  },
  
  // Pricing
  pricing: {
    type: {
      type: String,
      enum: ['free', 'one-time', 'subscription', 'per-session'],
      required: true,
    },
    amount: {
      type: Number,
      required: function() {
        return this.pricing.type !== 'free';
      },
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
    },
    isDiscountActive: {
      type: Boolean,
      default: false,
    },
    discountEndDate: Date,
  },
  
  // Program Content
  exercises: [{
    name: {
      type: String,
      required: true,
    },
    description: String,
    instructions: [String],
    muscleGroups: [{
      type: String,
      enum: [
        'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
        'abs', 'obliques', 'lower-back', 'glutes', 'quadriceps',
        'hamstrings', 'calves', 'full-body', 'cardio'
      ],
    }],
    equipment: [{
      type: String,
      enum: [
        'none', 'dumbbells', 'barbells', 'kettlebells', 'resistance-bands',
        'pull-up-bar', 'bench', 'squat-rack', 'cable-machine', 'treadmill',
        'stationary-bike', 'rowing-machine', 'medicine-ball', 'foam-roller',
        'yoga-mat', 'stability-ball', 'trx', 'battle-ropes'
      ],
    }],
    sets: Number,
    reps: String, // Can be "10-12" or "30 seconds" etc.
    restTime: Number, // in seconds
    weight: String, // Can be "bodyweight" or "75% 1RM" etc.
    videoUrl: String,
    imageUrl: String,
    tips: [String],
    commonMistakes: [String],
    alternatives: [String],
  }],
  
  // Weekly Schedule
  weeklySchedule: [{
    week: {
      type: Number,
      required: true,
    },
    workouts: [{
      day: {
        type: Number,
        required: true,
        min: 1,
        max: 7,
      },
      title: String,
      description: String,
      estimatedDuration: Number, // in minutes
      exercises: [{
        exercise: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'exercises',
        },
        sets: Number,
        reps: String,
        weight: String,
        restTime: Number,
        notes: String,
      }],
      warmUp: [{
        name: String,
        duration: Number,
        description: String,
      }],
      coolDown: [{
        name: String,
        duration: Number,
        description: String,
      }],
    }],
  }],
  
  // Program Requirements
  requirements: {
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    equipment: [{
      type: String,
      enum: [
        'none', 'basic-home-gym', 'full-gym', 'dumbbells-only',
        'bodyweight-only', 'resistance-bands', 'kettlebells'
      ],
    }],
    timeCommitment: String,
    space: {
      type: String,
      enum: ['minimal', 'small-room', 'full-gym', 'outdoor'],
    },
    prerequisites: [String],
  },
  
  // Program Goals and Benefits
  goals: [{
    type: String,
    enum: [
      'weight-loss', 'muscle-gain', 'strength-building', 'endurance',
      'flexibility', 'balance', 'coordination', 'sport-performance',
      'rehabilitation', 'general-fitness', 'stress-relief'
    ],
  }],
  
  benefits: [String],
  
  // Media and Resources
  images: [{
    url: {
      type: String,
      required: true,
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false,
    },
  }],
  
  videos: [{
    title: String,
    url: String,
    description: String,
    duration: Number, // in seconds
    type: {
      type: String,
      enum: ['intro', 'workout', 'technique', 'nutrition'],
    },
  }],
  
  documents: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'nutrition-plan', 'workout-log', 'guide'],
    },
    description: String,
  }],
  
  // Progress Tracking
  progressMetrics: [{
    name: {
      type: String,
      required: true,
    },
    unit: String,
    description: String,
    targetValue: Number,
  }],
  
  // Program Status and Metrics
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  
  metrics: {
    enrollments: {
      type: Number,
      default: 0,
    },
    completions: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: Number,
      default: 0,
    },
  },
  
  // Reviews and Ratings
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
  }],
  
  // FAQ
  faq: [{
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  }],
  
  // Program Settings
  settings: {
    isPublic: {
      type: Boolean,
      default: true,
    },
    allowReviews: {
      type: Boolean,
      default: true,
    },
    maxEnrollments: Number,
    startDate: Date,
    endDate: Date,
    autoArchive: {
      type: Boolean,
      default: false,
    },
  },
  
  // SEO and Marketing
  seo: {
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  
  tags: [String],
  
  isActive: {
    type: Boolean,
    default: true,
  },
  publishedDate: Date,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better performance
programSchema.index({ title: 'text', description: 'text', tags: 'text' });
programSchema.index({ trainer: 1 });
programSchema.index({ category: 1 });
programSchema.index({ difficulty: 1 });
programSchema.index({ 'pricing.type': 1, 'pricing.amount': 1 });
programSchema.index({ 'metrics.averageRating': -1 });
programSchema.index({ 'metrics.enrollments': -1 });
programSchema.index({ publishedDate: -1 });
programSchema.index({ status: 1, isActive: 1 });

// Virtual for total duration in hours
programSchema.virtual('totalDurationHours').get(function() {
  const totalMinutes = this.duration.weeks * 
                      this.duration.sessionsPerWeek * 
                      this.duration.sessionDuration;
  return Math.round(totalMinutes / 60 * 100) / 100;
});

// Virtual for effective price (considering discounts)
programSchema.virtual('effectivePrice').get(function() {
  if (this.pricing.type === 'free') return 0;
  if (this.pricing.isDiscountActive && this.pricing.discountPrice) {
    return this.pricing.discountPrice;
  }
  return this.pricing.amount;
});

// Virtual for completion rate
programSchema.virtual('completionRate').get(function() {
  if (this.metrics.enrollments === 0) return 0;
  return Math.round((this.metrics.completions / this.metrics.enrollments) * 100);
});

// Static method to find published programs
programSchema.statics.findPublished = function() {
  return this.find({ 
    status: 'published', 
    isActive: true,
    'settings.isPublic': true
  });
};

// Static method to search programs
programSchema.statics.searchPrograms = function(query, filters = {}) {
  const searchCriteria = {
    status: 'published',
    isActive: true,
    'settings.isPublic': true,
    ...filters,
  };

  if (query) {
    searchCriteria.$text = { $search: query };
  }

  return this.find(searchCriteria);
};

// Instance method to add review
programSchema.methods.addReview = function(userId, rating, comment) {
  this.reviews.push({
    user: userId,
    rating,
    comment,
  });
  
  // Update average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.metrics.averageRating = totalRating / this.reviews.length;
  this.metrics.totalReviews = this.reviews.length;
  
  return this.save();
};

// Instance method to increment views
programSchema.methods.incrementViews = function() {
  this.metrics.views += 1;
  return this.save();
};

// Instance method to increment enrollments
programSchema.methods.incrementEnrollments = function() {
  this.metrics.enrollments += 1;
  return this.save();
};

// Instance method to increment completions
programSchema.methods.incrementCompletions = function() {
  this.metrics.completions += 1;
  return this.save();
};

// Pre-save middleware to generate slug
programSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.seo.slug) {
    this.seo.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  if (this.isModified()) {
    this.lastUpdated = new Date();
  }
  
  next();
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;
