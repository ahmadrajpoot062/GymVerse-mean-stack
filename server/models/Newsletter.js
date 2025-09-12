const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['subscribed', 'unsubscribed', 'bounced'],
    default: 'subscribed'
  },
  preferences: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    categories: [{
      type: String,
      enum: ['fitness', 'nutrition', 'wellness', 'training', 'lifestyle', 'promotions']
    }]
  },
  source: {
    type: String,
    default: 'website'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: Date,
  lastEmailSent: Date,
  emailsSent: {
    type: Number,
    default: 0
  },
  emailsOpened: {
    type: Number,
    default: 0
  },
  linksClicked: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes (email has unique: true, so no need for explicit index)
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ subscribedAt: -1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);
