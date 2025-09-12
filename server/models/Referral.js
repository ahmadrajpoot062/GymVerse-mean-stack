const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referred: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending'
  },
  reward: {
    type: {
      type: String,
      enum: ['discount', 'credit', 'free_month'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    applied: {
      type: Boolean,
      default: false
    }
  },
  completedAt: Date,
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Performance indexes (excluding code which has unique: true)
referralSchema.index({ referrer: 1 });
referralSchema.index({ referred: 1 });
referralSchema.index({ status: 1 });

module.exports = mongoose.model('Referral', referralSchema);
