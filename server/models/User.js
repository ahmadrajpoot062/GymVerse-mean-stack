/**
 * User Model for GymVerse
 * Handles User, Trainer, and Admin accounts
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'trainer', 'admin'],
    default: 'user',
  },
  profile: {
    avatar: {
      type: String,
      default: '/uploads/avatars/default-avatar.png',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    phone: {
      type: String,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number'],
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    fitnessGoals: [{
      type: String,
      enum: [
        'weight-loss',
        'weight-gain',
        'muscle-building',
        'strength-training',
        'cardio-fitness',
        'flexibility',
        'general-health',
        'sports-performance'
      ],
    }],
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    medicalConditions: [{
      type: String,
    }],
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
      marketing: {
        type: Boolean,
        default: false,
      },
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'members-only', 'private'],
        default: 'members-only',
      },
      showProgress: {
        type: Boolean,
        default: true,
      },
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto',
    },
  },
  membership: {
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Membership',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'cancelled'],
      default: 'inactive',
    },
    startDate: Date,
    endDate: Date,
    autoRenew: {
      type: Boolean,
      default: false,
    },
  },
  favoritePrograms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
  }],
  favoriteTrainers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
  }],
  workoutHistory: [{
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
    },
    exercises: [{
      name: String,
      sets: Number,
      reps: Number,
      weight: Number,
      duration: Number, // in minutes
      notes: String,
    }],
    date: {
      type: Date,
      default: Date.now,
    },
    duration: Number, // total workout duration in minutes
    caloriesBurned: Number,
    notes: String,
  }],
  progressTracking: {
    weight: [{
      value: Number,
      unit: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg',
      },
      date: {
        type: Date,
        default: Date.now,
      },
    }],
    bodyMeasurements: [{
      chest: Number,
      waist: Number,
      hips: Number,
      biceps: Number,
      thighs: Number,
      date: {
        type: Date,
        default: Date.now,
      },
      unit: {
        type: String,
        enum: ['cm', 'inches'],
        default: 'cm',
      },
    }],
    photos: [{
      url: String,
      type: {
        type: String,
        enum: ['front', 'back', 'side'],
      },
      date: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Performance indexes (excluding email which has unique: true)
userSchema.index({ role: 1 });
userSchema.index({ 'membership.status': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for account locked status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for age calculation
userSchema.virtual('age').get(function() {
  if (!this.profile.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.profile.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we're already at max attempts and not locked, lock the account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to get active users count
userSchema.statics.getActiveUsersCount = function() {
  return this.countDocuments({ isActive: true });
};

// Static method to get users by role
userSchema.statics.getUsersByRole = function(role) {
  return this.find({ role, isActive: true });
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpires;
  delete userObject.loginAttempts;
  delete userObject.lockUntil;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
