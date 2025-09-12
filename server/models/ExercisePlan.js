/**
 * Exercise Plan Model for GymVerse
 * Built-in workout plans with difficulty levels
 */

const mongoose = require('mongoose');

const exercisePlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise plan name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters'],
  },
  
  // Plan Classification
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'full-body',
      'upper-body',
      'lower-body',
      'push',
      'pull',
      'legs',
      'cardio',
      'hiit',
      'strength',
      'endurance',
      'flexibility',
      'core',
      'back',
      'chest',
      'shoulders',
      'arms',
      'abs'
    ],
  },
  
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  
  // Plan Details
  duration: {
    total: {
      type: Number,
      required: [true, 'Total duration is required'],
      min: [15, 'Duration must be at least 15 minutes'],
      max: [180, 'Duration cannot exceed 180 minutes'],
    },
    warmUp: {
      type: Number,
      default: 5,
    },
    workout: {
      type: Number,
      required: true,
    },
    coolDown: {
      type: Number,
      default: 5,
    },
  },
  
  // Target Information
  targetMuscles: [{
    type: String,
    enum: [
      'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
      'abs', 'obliques', 'lower-back', 'glutes', 'quadriceps',
      'hamstrings', 'calves', 'hip-flexors', 'full-body', 'cardio'
    ],
  }],
  
  goals: [{
    type: String,
    enum: [
      'weight-loss', 'muscle-gain', 'strength-building', 'endurance',
      'flexibility', 'balance', 'coordination', 'sport-performance',
      'rehabilitation', 'general-fitness', 'stress-relief', 'toning'
    ],
  }],
  
  // Equipment Requirements
  equipment: [{
    name: {
      type: String,
      required: true,
      enum: [
        'none', 'dumbbells', 'barbells', 'kettlebells', 'resistance-bands',
        'pull-up-bar', 'bench', 'squat-rack', 'cable-machine', 'treadmill',
        'stationary-bike', 'rowing-machine', 'medicine-ball', 'foam-roller',
        'yoga-mat', 'stability-ball', 'trx', 'battle-ropes', 'suspension-trainer',
        'jump-rope', 'plyo-box', 'agility-ladder', 'parallette-bars'
      ],
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    alternatives: [String],
  }],
  
  // Workout Structure
  warmUp: [{
    name: {
      type: String,
      required: true,
    },
    description: String,
    duration: {
      type: Number,
      required: true, // in seconds
    },
    instructions: [String],
    videoUrl: String,
    imageUrl: String,
  }],
  
  exercises: [{
    name: {
      type: String,
      required: true,
    },
    description: String,
    instructions: [String],
    
    // Exercise Parameters
    sets: {
      type: Number,
      required: true,
      min: 1,
    },
    reps: {
      type: String, // Can be "10-12", "30 seconds", "AMRAP", etc.
      required: true,
    },
    weight: {
      type: String, // "bodyweight", "moderate", "75% 1RM", "15kg", etc.
      default: 'bodyweight',
    },
    restTime: {
      type: Number, // in seconds
      default: 60,
    },
    tempo: String, // e.g., "2-1-2-1" (eccentric-pause-concentric-pause)
    
    // Exercise Details
    muscleGroups: [{
      type: String,
      enum: [
        'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
        'abs', 'obliques', 'lower-back', 'glutes', 'quadriceps',
        'hamstrings', 'calves', 'hip-flexors', 'full-body', 'cardio'
      ],
    }],
    
    equipment: [String],
    
    // Media and Guidance
    videoUrl: String,
    imageUrl: String,
    animationUrl: String, // For animated demonstrations
    
    // Tips and Safety
    tips: [String],
    commonMistakes: [String],
    safetyNotes: [String],
    modifications: [{
      level: {
        type: String,
        enum: ['easier', 'harder'],
      },
      description: String,
      instructions: [String],
    }],
    
    // Tracking
    trackingMetrics: [{
      name: String,
      unit: String,
      description: String,
    }],
  }],
  
  coolDown: [{
    name: {
      type: String,
      required: true,
    },
    description: String,
    duration: {
      type: Number,
      required: true, // in seconds
    },
    instructions: [String],
    videoUrl: String,
    imageUrl: String,
    type: {
      type: String,
      enum: ['stretch', 'breathing', 'relaxation', 'mobility'],
    },
  }],
  
  // Plan Metadata
  tags: [String],
  
  estimatedCaloriesBurn: {
    min: Number,
    max: Number,
    average: Number,
  },
  
  // Progression and Variations
  progressionNotes: String,
  nextLevelPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExercisePlan',
  },
  previousLevelPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExercisePlan',
  },
  
  variations: [{
    name: String,
    description: String,
    changes: [String],
  }],
  
  // Requirements and Recommendations
  requirements: {
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    timeAvailable: Number, // in minutes
    spaceRequired: {
      type: String,
      enum: ['minimal', 'small-room', 'large-room', 'gym'],
    },
    experience: [String], // Prerequisites
  },
  
  recommendations: {
    frequency: {
      type: String, // "2-3 times per week", "Daily", etc.
    },
    bestTimeOfDay: [String],
    restDaysBetween: Number,
    combinationWith: [String], // Other plan types that work well together
  },
  
  // Warnings and Contraindications
  warnings: [String],
  contraindications: [String],
  modifications: [{
    condition: String, // e.g., "Lower back pain", "Knee injury"
    modifications: [String],
  }],
  
  // Plan Statistics
  statistics: {
    timesCompleted: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  
  // User Feedback
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now,
    },
    difficulty: {
      type: String,
      enum: ['too-easy', 'just-right', 'too-hard'],
    },
    effectiveness: {
      type: Number,
      min: 1,
      max: 5,
    },
  }],
  
  // Content Management
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published',
  },
  
  isActive: {
    type: Boolean,
    default: true,
  },
  
  isFeatured: {
    type: Boolean,
    default: false,
  },
  
  // SEO
  seo: {
    slug: String,
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
exercisePlanSchema.index({ category: 1, difficulty: 1 });
exercisePlanSchema.index({ targetMuscles: 1 });
exercisePlanSchema.index({ goals: 1 });
exercisePlanSchema.index({ 'duration.total': 1 });
exercisePlanSchema.index({ 'statistics.averageRating': -1 });
exercisePlanSchema.index({ 'statistics.timesCompleted': -1 });
exercisePlanSchema.index({ tags: 1 });
exercisePlanSchema.index({ status: 1, isActive: 1 });

// Text search index
exercisePlanSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  'exercises.name': 'text'
});

// Virtual for total exercises count
exercisePlanSchema.virtual('totalExercises').get(function() {
  return this.exercises.length;
});

// Virtual for estimated total time including rest
exercisePlanSchema.virtual('estimatedTotalTime').get(function() {
  let totalTime = this.duration.warmUp + this.duration.coolDown;
  
  this.exercises.forEach(exercise => {
    // Estimate time per set (assuming 30 seconds per set on average)
    const estimatedSetTime = 30;
    const totalSets = exercise.sets;
    const restTime = exercise.restTime || 60;
    
    totalTime += (totalSets * estimatedSetTime) + ((totalSets - 1) * restTime);
  });
  
  return Math.round(totalTime / 60); // Convert to minutes
});

// Virtual for difficulty score
exercisePlanSchema.virtual('difficultyScore').get(function() {
  const scores = { beginner: 1, intermediate: 2, advanced: 3 };
  return scores[this.difficulty] || 1;
});

// Static method to find by difficulty
exercisePlanSchema.statics.findByDifficulty = function(difficulty) {
  return this.find({ 
    difficulty, 
    status: 'published', 
    isActive: true 
  });
};

// Static method to find by category
exercisePlanSchema.statics.findByCategory = function(category) {
  return this.find({ 
    category, 
    status: 'published', 
    isActive: true 
  });
};

// Static method to find by target muscles
exercisePlanSchema.statics.findByTargetMuscles = function(muscles) {
  return this.find({ 
    targetMuscles: { $in: muscles },
    status: 'published', 
    isActive: true 
  });
};

// Static method to find by duration range
exercisePlanSchema.statics.findByDuration = function(minDuration, maxDuration) {
  return this.find({
    'duration.total': { $gte: minDuration, $lte: maxDuration },
    status: 'published',
    isActive: true
  });
};

// Static method to search plans
exercisePlanSchema.statics.searchPlans = function(query, filters = {}) {
  const searchCriteria = {
    status: 'published',
    isActive: true,
    ...filters,
  };

  if (query) {
    searchCriteria.$text = { $search: query };
  }

  return this.find(searchCriteria);
};

// Instance method to add review
exercisePlanSchema.methods.addReview = function(userId, rating, comment, difficulty, effectiveness) {
  this.reviews.push({
    user: userId,
    rating,
    comment,
    difficulty,
    effectiveness,
  });
  
  // Update average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.statistics.averageRating = totalRating / this.reviews.length;
  this.statistics.totalRatings = this.reviews.length;
  
  return this.save();
};

// Instance method to increment completion count
exercisePlanSchema.methods.incrementCompletions = function() {
  this.statistics.timesCompleted += 1;
  return this.save();
};

// Instance method to increment views
exercisePlanSchema.methods.incrementViews = function() {
  this.statistics.views += 1;
  return this.save();
};

// Instance method to increment favorites
exercisePlanSchema.methods.incrementFavorites = function() {
  this.statistics.favorites += 1;
  return this.save();
};

// Pre-save middleware to generate slug
exercisePlanSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Calculate workout duration if not set
  if (!this.duration.workout && this.duration.total) {
    this.duration.workout = this.duration.total - this.duration.warmUp - this.duration.coolDown;
  }
  
  next();
});

const ExercisePlan = mongoose.model('ExercisePlan', exercisePlanSchema);

module.exports = ExercisePlan;
