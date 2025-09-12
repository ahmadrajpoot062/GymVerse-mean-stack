/**
 * Diet Plan Model for GymVerse
 * Weight loss and weight gain meal plans
 */

const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Diet plan name is required'],
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
  type: {
    type: String,
    required: [true, 'Diet plan type is required'],
    enum: ['weight-loss', 'weight-gain', 'maintenance', 'muscle-gain', 'cutting', 'bulking'],
  },
  
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  
  // Plan Duration
  duration: {
    weeks: {
      type: Number,
      required: [true, 'Duration in weeks is required'],
      min: [1, 'Duration must be at least 1 week'],
      max: [52, 'Duration cannot exceed 52 weeks'],
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
  },
  
  // Nutritional Targets
  nutritionalGoals: {
    dailyCalories: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      target: {
        type: Number,
        required: true,
      },
    },
    macronutrients: {
      protein: {
        grams: Number,
        percentage: Number,
        caloriesPerGram: {
          type: Number,
          default: 4,
        },
      },
      carbohydrates: {
        grams: Number,
        percentage: Number,
        caloriesPerGram: {
          type: Number,
          default: 4,
        },
      },
      fats: {
        grams: Number,
        percentage: Number,
        caloriesPerGram: {
          type: Number,
          default: 9,
        },
      },
      fiber: {
        grams: Number,
        recommendation: String,
      },
    },
    micronutrients: [{
      name: String, // e.g., "Vitamin D", "Iron", "Calcium"
      amount: Number,
      unit: String, // "mg", "mcg", "IU"
      importance: String,
    }],
    hydration: {
      dailyWaterIntake: {
        type: Number, // in liters
        default: 2.5,
      },
      additionalFluids: [String],
    },
  },
  
  // Weekly Meal Plans
  weeklyPlans: [{
    week: {
      type: Number,
      required: true,
      min: 1,
    },
    theme: String, // e.g., "Introduction Week", "Boost Week"
    description: String,
    
    dailyPlans: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true,
      },
      
      meals: [{
        name: {
          type: String,
          required: true,
          enum: ['breakfast', 'mid-morning-snack', 'lunch', 'afternoon-snack', 'dinner', 'evening-snack', 'pre-workout', 'post-workout'],
        },
        time: String, // e.g., "8:00 AM"
        
        foods: [{
          name: {
            type: String,
            required: true,
          },
          quantity: {
            amount: {
              type: Number,
              required: true,
            },
            unit: {
              type: String,
              required: true,
              enum: ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'serving'],
            },
          },
          
          // Nutritional Information
          nutrition: {
            calories: Number,
            protein: Number, // in grams
            carbohydrates: Number, // in grams
            fats: Number, // in grams
            fiber: Number, // in grams
            sugar: Number, // in grams
            sodium: Number, // in mg
          },
          
          // Food Details
          category: {
            type: String,
            enum: [
              'protein', 'carbohydrate', 'fat', 'vegetable', 'fruit', 
              'dairy', 'grain', 'legume', 'nut', 'seed', 'beverage',
              'condiment', 'spice', 'supplement'
            ],
          },
          
          alternatives: [String], // Alternative foods with similar nutrition
          isOptional: {
            type: Boolean,
            default: false,
          },
          notes: String,
        }],
        
        // Meal Totals
        totalNutrition: {
          calories: Number,
          protein: Number,
          carbohydrates: Number,
          fats: Number,
          fiber: Number,
        },
        
        // Meal Instructions
        preparationTime: Number, // in minutes
        cookingTime: Number, // in minutes
        difficulty: {
          type: String,
          enum: ['easy', 'medium', 'hard'],
          default: 'easy',
        },
        
        instructions: [String],
        tips: [String],
        
        // Recipe Details
        recipe: {
          ingredients: [String],
          steps: [String],
          servings: Number,
          equipment: [String],
        },
        
        // Media
        imageUrl: String,
        videoUrl: String,
      }],
      
      // Daily Totals
      dailyTotals: {
        calories: Number,
        protein: Number,
        carbohydrates: Number,
        fats: Number,
        fiber: Number,
        water: Number, // in liters
      },
      
      // Daily Notes
      notes: String,
      supplements: [String],
      specialInstructions: [String],
    }],
    
    // Weekly Summary
    weeklyAverages: {
      dailyCalories: Number,
      dailyProtein: Number,
      dailyCarbs: Number,
      dailyFats: Number,
    },
    
    // Shopping List for the Week
    shoppingList: [{
      category: String,
      items: [{
        name: String,
        quantity: String,
        estimatedCost: Number,
        alternatives: [String],
      }],
    }],
  }],
  
  // Plan Guidelines
  guidelines: {
    generalRules: [String],
    mealTiming: [String],
    portionGuidelines: [String],
    hydrationTips: [String],
    supplementRecommendations: [String],
    
    // Dietary Restrictions Support
    allergies: [{
      allergen: String,
      alternatives: [String],
      warnings: [String],
    }],
    
    dietaryPreferences: [{
      preference: {
        type: String,
        enum: ['vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo', 'gluten-free', 'dairy-free', 'low-sodium'],
      },
      modifications: [String],
    }],
  },
  
  // Progress Tracking
  trackingMetrics: [{
    name: {
      type: String,
      required: true,
    },
    unit: String,
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
    },
    targetRange: {
      min: Number,
      max: Number,
    },
    instructions: String,
  }],
  
  // Expected Results
  expectedResults: {
    weightChange: {
      amount: Number, // positive for gain, negative for loss
      unit: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg',
      },
      timeframe: String, // e.g., "per week", "total"
    },
    bodyComposition: String,
    energyLevels: String,
    otherBenefits: [String],
  },
  
  // Requirements and Warnings
  requirements: {
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active'],
      required: true,
    },
    cookingSkills: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    timeCommitment: {
      mealPrep: Number, // hours per week
      cooking: Number, // average minutes per meal
    },
    budgetLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
  },
  
  warnings: [String],
  contraindications: [String],
  medicalConsiderations: [String],
  
  // Plan Statistics
  statistics: {
    followers: {
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
    totalRatings: {
      type: Number,
      default: 0,
    },
    successRate: Number, // percentage of users who achieved their goals
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
    
    // Specific Feedback
    ease: {
      type: Number,
      min: 1,
      max: 5,
    },
    taste: {
      type: Number,
      min: 1,
      max: 5,
    },
    effectiveness: {
      type: Number,
      min: 1,
      max: 5,
    },
    value: {
      type: Number,
      min: 1,
      max: 5,
    },
    
    // Results Achieved
    weightChangeAchieved: Number,
    timeFollowed: Number, // in weeks
    wouldRecommend: Boolean,
    
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Content Management
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  nutritionistApproved: {
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    date: Date,
    credentials: String,
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
  
  // Media
  images: [{
    url: String,
    caption: String,
    type: {
      type: String,
      enum: ['hero', 'meal', 'ingredient', 'result'],
    },
  }],
  
  tags: [String],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
dietPlanSchema.index({ type: 1, difficulty: 1 });
dietPlanSchema.index({ 'nutritionalGoals.dailyCalories.target': 1 });
dietPlanSchema.index({ 'requirements.activityLevel': 1 });
dietPlanSchema.index({ 'statistics.averageRating': -1 });
dietPlanSchema.index({ 'statistics.followers': -1 });
dietPlanSchema.index({ status: 1, isActive: 1 });
dietPlanSchema.index({ tags: 1 });

// Text search index
dietPlanSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
});

// Virtual for total weeks
dietPlanSchema.virtual('totalWeeks').get(function() {
  return this.duration.weeks;
});

// Virtual for average daily calories
dietPlanSchema.virtual('averageDailyCalories').get(function() {
  return this.nutritionalGoals.dailyCalories.target;
});

// Virtual for protein percentage
dietPlanSchema.virtual('proteinPercentage').get(function() {
  return this.nutritionalGoals.macronutrients.protein.percentage;
});

// Virtual for carbs percentage
dietPlanSchema.virtual('carbsPercentage').get(function() {
  return this.nutritionalGoals.macronutrients.carbohydrates.percentage;
});

// Virtual for fats percentage
dietPlanSchema.virtual('fatsPercentage').get(function() {
  return this.nutritionalGoals.macronutrients.fats.percentage;
});

// Static method to find by type
dietPlanSchema.statics.findByType = function(type) {
  return this.find({ 
    type, 
    status: 'published', 
    isActive: true 
  });
};

// Static method to find by calorie range
dietPlanSchema.statics.findByCalorieRange = function(minCalories, maxCalories) {
  return this.find({
    'nutritionalGoals.dailyCalories.target': { 
      $gte: minCalories, 
      $lte: maxCalories 
    },
    status: 'published',
    isActive: true
  });
};

// Static method to search diet plans
dietPlanSchema.statics.searchPlans = function(query, filters = {}) {
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
dietPlanSchema.methods.addReview = function(userId, rating, comment, feedback) {
  this.reviews.push({
    user: userId,
    rating,
    comment,
    ...feedback,
  });
  
  // Update average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.statistics.averageRating = totalRating / this.reviews.length;
  this.statistics.totalRatings = this.reviews.length;
  
  return this.save();
};

// Instance method to increment followers
dietPlanSchema.methods.incrementFollowers = function() {
  this.statistics.followers += 1;
  return this.save();
};

// Instance method to increment completions
dietPlanSchema.methods.incrementCompletions = function() {
  this.statistics.completions += 1;
  return this.save();
};

// Instance method to increment views
dietPlanSchema.methods.incrementViews = function() {
  this.statistics.views += 1;
  return this.save();
};

// Instance method to calculate shopping list for a specific week
dietPlanSchema.methods.getShoppingListForWeek = function(weekNumber) {
  const week = this.weeklyPlans.find(w => w.week === weekNumber);
  return week ? week.shoppingList : [];
};

// Instance method to get daily meal plan
dietPlanSchema.methods.getDailyPlan = function(weekNumber, day) {
  const week = this.weeklyPlans.find(w => w.week === weekNumber);
  if (!week) return null;
  
  return week.dailyPlans.find(d => d.day === day);
};

// Pre-save middleware to calculate macro percentages
dietPlanSchema.pre('save', function(next) {
  // Generate slug if not exists
  if (this.isModified('name') && !this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Calculate macro percentages if not set
  const macros = this.nutritionalGoals.macronutrients;
  const totalCalories = this.nutritionalGoals.dailyCalories.target;
  
  if (macros.protein.grams && !macros.protein.percentage) {
    macros.protein.percentage = Math.round((macros.protein.grams * 4 / totalCalories) * 100);
  }
  
  if (macros.carbohydrates.grams && !macros.carbohydrates.percentage) {
    macros.carbohydrates.percentage = Math.round((macros.carbohydrates.grams * 4 / totalCalories) * 100);
  }
  
  if (macros.fats.grams && !macros.fats.percentage) {
    macros.fats.percentage = Math.round((macros.fats.grams * 9 / totalCalories) * 100);
  }
  
  next();
});

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

module.exports = DietPlan;
