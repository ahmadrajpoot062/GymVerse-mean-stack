/**
 * Membership Model for GymVerse
 * Different membership tiers and plans
 */

const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Membership name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  type: {
    type: String,
    required: [true, 'Membership type is required'],
    enum: ['basic', 'standard', 'premium', 'vip', 'trial'],
  },
  description: {
    type: String,
    required: [true, 'Membership description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  shortDescription: {
    type: String,
    maxlength: [100, 'Short description cannot exceed 100 characters'],
  },
  
  // Pricing Information
  pricing: {
    monthly: {
      amount: {
        type: Number,
        required: [true, 'Monthly price is required'],
        min: [0, 'Price cannot be negative'],
      },
      currency: {
        type: String,
        default: 'USD',
      },
      discountPrice: Number,
      isDiscountActive: {
        type: Boolean,
        default: false,
      },
    },
    yearly: {
      amount: {
        type: Number,
        min: [0, 'Price cannot be negative'],
      },
      currency: {
        type: String,
        default: 'USD',
      },
      discountPrice: Number,
      isDiscountActive: {
        type: Boolean,
        default: false,
      },
      savePercentage: Number, // How much % saved compared to monthly
    },
    trial: {
      days: {
        type: Number,
        default: 0,
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
  },
  
  // Features and Benefits
  features: [{
    name: {
      type: String,
      required: true,
    },
    description: String,
    isIncluded: {
      type: Boolean,
      default: true,
    },
    limitation: String, // e.g., "Up to 5 sessions per month"
    category: {
      type: String,
      enum: [
        'gym-access',
        'classes',
        'training',
        'nutrition',
        'support',
        'equipment',
        'extras'
      ],
    },
  }],
  
  // Access Permissions
  permissions: {
    gymAccess: {
      type: Boolean,
      default: true,
    },
    accessHours: {
      type: String,
      enum: ['24/7', 'business-hours', 'limited'],
      default: 'business-hours',
    },
    groupClasses: {
      unlimited: {
        type: Boolean,
        default: false,
      },
      monthlyLimit: Number,
      specificClasses: [String],
    },
    personalTraining: {
      included: {
        type: Boolean,
        default: false,
      },
      sessionsPerMonth: Number,
      discountPercentage: Number,
    },
    nutritionConsultation: {
      included: {
        type: Boolean,
        default: false,
      },
      sessionsPerMonth: Number,
    },
    guestPasses: {
      perMonth: {
        type: Number,
        default: 0,
      },
      perYear: Number,
    },
    freezeAccount: {
      allowed: {
        type: Boolean,
        default: false,
      },
      maxDaysPerYear: Number,
      cost: Number,
    },
  },
  
  // Restrictions and Limitations
  restrictions: {
    contractLength: {
      minimum: {
        type: Number,
        default: 1, // months
      },
      maximum: Number,
    },
    cancellationPolicy: {
      noticePeriod: {
        type: Number,
        default: 30, // days
      },
      cancellationFee: Number,
      earlyTerminationFee: Number,
    },
    ageRestrictions: {
      minimum: Number,
      maximum: Number,
    },
    locationAccess: [{
      type: String, // Specific gym locations if applicable
    }],
  },
  
  // Promotional Information
  promotion: {
    isActive: {
      type: Boolean,
      default: false,
    },
    title: String,
    description: String,
    discountPercentage: Number,
    discountAmount: Number,
    validFrom: Date,
    validUntil: Date,
    maxUses: Number,
    currentUses: {
      type: Number,
      default: 0,
    },
    applicableFor: {
      type: String,
      enum: ['new-members', 'existing-members', 'all'],
      default: 'new-members',
    },
  },
  
  // Visual and Marketing
  styling: {
    color: {
      type: String,
      default: '#DC2626', // Default red from our color scheme
    },
    icon: String,
    badge: String, // e.g., "Most Popular", "Best Value"
    badgeColor: String,
  },
  
  images: [{
    url: String,
    caption: String,
    type: {
      type: String,
      enum: ['hero', 'feature', 'facility'],
    },
  }],
  
  // Additional Services
  addOns: [{
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD',
      },
      billing: {
        type: String,
        enum: ['monthly', 'yearly', 'one-time'],
        default: 'monthly',
      },
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  }],
  
  // Membership Statistics
  statistics: {
    totalMembers: {
      type: Number,
      default: 0,
    },
    activeMembers: {
      type: Number,
      default: 0,
    },
    averageRetention: Number, // in months
    satisfactionScore: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    renewalRate: Number, // percentage
  },
  
  // Comparison Matrix
  comparison: {
    highlights: [String], // Key selling points
    vsBasic: [String], // What's better than basic
    vsStandard: [String], // What's better than standard
    vsPremium: [String], // What's better than premium
  },
  
  // Terms and Conditions
  terms: {
    contractTerms: String,
    paymentTerms: String,
    refundPolicy: String,
    membershipRules: [String],
    facilityRules: [String],
  },
  
  // Settings
  settings: {
    isActive: {
      type: Boolean,
      default: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    allowOnlineSignup: {
      type: Boolean,
      default: true,
    },
    requireApproval: {
      type: Boolean,
      default: false,
    },
    maxMembers: Number, // Capacity limit
    priority: {
      type: Number,
      default: 0, // For sorting display order
    },
  },
  
  // SEO
  seo: {
    slug: String,
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
membershipSchema.index({ type: 1 });
membershipSchema.index({ 'pricing.monthly.amount': 1 });
membershipSchema.index({ 'settings.isActive': 1, 'settings.isVisible': 1 });
membershipSchema.index({ 'settings.priority': -1 });

// Virtual for effective monthly price
membershipSchema.virtual('effectiveMonthlyPrice').get(function() {
  const monthly = this.pricing.monthly;
  if (monthly.isDiscountActive && monthly.discountPrice) {
    return monthly.discountPrice;
  }
  return monthly.amount;
});

// Virtual for effective yearly price
membershipSchema.virtual('effectiveYearlyPrice').get(function() {
  const yearly = this.pricing.yearly;
  if (!yearly.amount) return null;
  
  if (yearly.isDiscountActive && yearly.discountPrice) {
    return yearly.discountPrice;
  }
  return yearly.amount;
});

// Virtual for yearly savings
membershipSchema.virtual('yearlySavings').get(function() {
  if (!this.pricing.yearly.amount) return 0;
  
  const monthlyTotal = this.effectiveMonthlyPrice * 12;
  const yearlyPrice = this.effectiveYearlyPrice;
  
  return monthlyTotal - yearlyPrice;
});

// Virtual for yearly savings percentage
membershipSchema.virtual('yearlySavingsPercentage').get(function() {
  if (!this.pricing.yearly.amount) return 0;
  
  const monthlyTotal = this.effectiveMonthlyPrice * 12;
  const savings = this.yearlySavings;
  
  return Math.round((savings / monthlyTotal) * 100);
});

// Virtual for feature categories
membershipSchema.virtual('featuresByCategory').get(function() {
  const categories = {};
  this.features.forEach(feature => {
    const category = feature.category || 'general';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(feature);
  });
  return categories;
});

// Static method to get active memberships
membershipSchema.statics.getActive = function() {
  return this.find({ 
    'settings.isActive': true, 
    'settings.isVisible': true 
  }).sort({ 'settings.priority': -1, 'pricing.monthly.amount': 1 });
};

// Static method to get membership by type
membershipSchema.statics.getByType = function(type) {
  return this.findOne({ 
    type, 
    'settings.isActive': true 
  });
};

// Instance method to increment member count
membershipSchema.methods.incrementMembers = function() {
  this.statistics.totalMembers += 1;
  this.statistics.activeMembers += 1;
  return this.save();
};

// Instance method to decrement member count
membershipSchema.methods.decrementMembers = function() {
  this.statistics.activeMembers = Math.max(0, this.statistics.activeMembers - 1);
  return this.save();
};

// Instance method to apply promotion
membershipSchema.methods.applyPromotion = function(discountPercentage, validUntil) {
  this.promotion.isActive = true;
  this.promotion.discountPercentage = discountPercentage;
  this.promotion.validUntil = validUntil;
  
  // Apply discount to monthly price
  const originalPrice = this.pricing.monthly.amount;
  this.pricing.monthly.discountPrice = originalPrice * (1 - discountPercentage / 100);
  this.pricing.monthly.isDiscountActive = true;
  
  // Apply discount to yearly price if exists
  if (this.pricing.yearly.amount) {
    const originalYearlyPrice = this.pricing.yearly.amount;
    this.pricing.yearly.discountPrice = originalYearlyPrice * (1 - discountPercentage / 100);
    this.pricing.yearly.isDiscountActive = true;
  }
  
  return this.save();
};

// Instance method to remove promotion
membershipSchema.methods.removePromotion = function() {
  this.promotion.isActive = false;
  this.pricing.monthly.isDiscountActive = false;
  this.pricing.monthly.discountPrice = undefined;
  
  if (this.pricing.yearly.amount) {
    this.pricing.yearly.isDiscountActive = false;
    this.pricing.yearly.discountPrice = undefined;
  }
  
  return this.save();
};

// Pre-save middleware to generate slug
membershipSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Calculate yearly savings percentage if not set
  if (this.pricing.yearly.amount && !this.pricing.yearly.savePercentage) {
    const monthlyTotal = this.pricing.monthly.amount * 12;
    const yearlyPrice = this.pricing.yearly.amount;
    this.pricing.yearly.savePercentage = Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
  }
  
  next();
});

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;
