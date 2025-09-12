/**
 * Trainer Model for GymVerse
 * Extended trainer profiles with approval system
 */

const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Basic Information
  name: {
    type: String,
    required: [true, 'Trainer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  
  // Professional Information
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
  },
  specialty: [{
    type: String,
    required: true,
    enum: [
      'strength-training',
      'cardio-fitness',
      'weight-loss',
      'muscle-building',
      'crossfit',
      'yoga',
      'pilates',
      'sports-specific',
      'rehabilitation',
      'nutrition',
      'bodybuilding',
      'powerlifting',
      'functional-training',
      'hiit',
      'flexibility',
      'seniors-fitness',
      'youth-fitness',
      'prenatal-fitness',
      'martial-arts',
      'dance-fitness'
    ],
  }],
  experience: {
    years: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience cannot exceed 50 years'],
    },
    description: {
      type: String,
      maxlength: [500, 'Experience description cannot exceed 500 characters'],
    },
  },
  
  // Certifications and Education
  certifications: [{
    name: {
      type: String,
      required: true,
    },
    issuingOrganization: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: Date,
    certificateUrl: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
  }],
  education: [{
    degree: String,
    institution: String,
    graduationYear: Number,
    field: String,
  }],
  
  // Media and Portfolio
  profileImage: {
    type: String,
    default: '/uploads/trainers/default-trainer.png',
  },
  portfolioImages: [{
    url: String,
    caption: String,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  }],
  videos: [{
    title: {
      type: String,
      required: true,
    },
    description: String,
    url: {
      type: String,
      required: true,
    },
    thumbnail: String,
    duration: Number, // in seconds
    category: {
      type: String,
      enum: [
        'workout-demo',
        'technique-tutorial',
        'motivation',
        'nutrition-tips',
        'client-testimonial',
        'exercise-form',
        'equipment-review',
        'program-preview'
      ],
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  }],
  
  // Social Media and Contact
  socialMedia: {
    instagram: String,
    facebook: String,
    youtube: String,
    tiktok: String,
    linkedin: String,
    website: String,
  },
  
  // Pricing and Services
  services: [{
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'USD',
      },
      per: {
        type: String,
        enum: ['session', 'hour', 'week', 'month', 'package'],
        default: 'session',
      },
    },
    duration: Number, // in minutes
    isActive: {
      type: Boolean,
      default: true,
    },
  }],
  
  // Availability
  availability: {
    schedule: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true,
      },
      timeSlots: [{
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
      }],
    }],
    timezone: {
      type: String,
      default: 'UTC',
    },
    isAcceptingClients: {
      type: Boolean,
      default: true,
    },
  },
  
  // Approval System
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
  },
  approvalDate: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectionReason: String,
  
  // Application Details
  applicationData: {
    motivation: {
      type: String,
      required: [true, 'Please explain why you want to become a trainer'],
      maxlength: [1000, 'Motivation cannot exceed 1000 characters'],
    },
    previousExperience: String,
    references: [{
      name: String,
      relationship: String,
      contact: String,
      notes: String,
    }],
    backgroundCheck: {
      isCompleted: {
        type: Boolean,
        default: false,
      },
      completedDate: Date,
      status: {
        type: String,
        enum: ['pending', 'passed', 'failed', 'not-required'],
        default: 'pending',
      },
    },
  },
  
  // Performance Metrics
  metrics: {
    totalClients: {
      type: Number,
      default: 0,
    },
    activeClients: {
      type: Number,
      default: 0,
    },
    totalSessions: {
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
    totalEarnings: {
      type: Number,
      default: 0,
    },
    profileViews: {
      type: Number,
      default: 0,
    },
    contactRequests: {
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
      maxlength: [500, 'Review comment cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  }],
  
  // Settings and Preferences
  settings: {
    emailNotifications: {
      newClients: {
        type: Boolean,
        default: true,
      },
      messages: {
        type: Boolean,
        default: true,
      },
      bookings: {
        type: Boolean,
        default: true,
      },
      reviews: {
        type: Boolean,
        default: true,
      },
    },
    privacy: {
      showEmail: {
        type: Boolean,
        default: false,
      },
      showPhone: {
        type: Boolean,
        default: true,
      },
      showSocialMedia: {
        type: Boolean,
        default: true,
      },
    },
  },
  
  isActive: {
    type: Boolean,
    default: true,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  lastActiveDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Performance indexes (excluding email which has unique: true)
trainerSchema.index({ status: 1 });
trainerSchema.index({ specialty: 1 });
trainerSchema.index({ 'metrics.averageRating': -1 });
trainerSchema.index({ 'metrics.totalClients': -1 });
trainerSchema.index({ approvalDate: -1 });
trainerSchema.index({ createdAt: -1 });

// Text search index
trainerSchema.index({
  name: 'text',
  bio: 'text',
  specialty: 'text',
  'certifications.name': 'text',
});

// Virtual for total years of experience
trainerSchema.virtual('totalExperience').get(function() {
  return this.experience.years;
});

// Virtual for approval status display
trainerSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'Pending Approval',
    approved: 'Approved',
    rejected: 'Rejected',
    suspended: 'Suspended',
  };
  return statusMap[this.status] || this.status;
});

// Virtual for active certifications
trainerSchema.virtual('activeCertifications').get(function() {
  const now = new Date();
  return this.certifications.filter(cert => {
    return !cert.expiryDate || cert.expiryDate > now;
  });
});

// Static method to find approved trainers
trainerSchema.statics.findApproved = function() {
  return this.find({ status: 'approved', isActive: true });
};

// Static method to find pending trainers
trainerSchema.statics.findPending = function() {
  return this.find({ status: 'pending', isActive: true });
};

// Static method to search trainers
trainerSchema.statics.searchTrainers = function(query, filters = {}) {
  const searchCriteria = {
    status: 'approved',
    isActive: true,
    ...filters,
  };

  if (query) {
    searchCriteria.$text = { $search: query };
  }

  return this.find(searchCriteria).sort({ 'metrics.averageRating': -1 });
};

// Instance method to approve trainer
trainerSchema.methods.approve = function(approvedBy) {
  this.status = 'approved';
  this.approvalDate = new Date();
  this.approvedBy = approvedBy;
  this.rejectionReason = undefined;
  return this.save();
};

// Instance method to reject trainer
trainerSchema.methods.reject = function(reason) {
  this.status = 'rejected';
  this.rejectionReason = reason;
  this.approvalDate = undefined;
  this.approvedBy = undefined;
  return this.save();
};

// Instance method to add review
trainerSchema.methods.addReview = function(userId, rating, comment) {
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

// Instance method to increment profile views
trainerSchema.methods.incrementViews = function() {
  this.metrics.profileViews += 1;
  return this.save();
};

// Instance method to increment contact requests
trainerSchema.methods.incrementContactRequests = function() {
  this.metrics.contactRequests += 1;
  return this.save();
};

// Pre-save middleware to update lastActiveDate
trainerSchema.pre('save', function(next) {
  if (this.isModified() && this.isModified() !== 'lastActiveDate') {
    this.lastActiveDate = new Date();
  }
  next();
});

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;
