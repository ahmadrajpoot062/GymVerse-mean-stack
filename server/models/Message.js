/**
 * Message Model for GymVerse
 * Contact form submissions and user messages
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Sender Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number'],
  },
  
  // Message Details
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  
  // Message Type
  type: {
    type: String,
    enum: [
      'general-inquiry',
      'membership-question',
      'trainer-inquiry',
      'technical-support',
      'complaint',
      'suggestion',
      'partnership',
      'media-inquiry',
      'other'
    ],
    default: 'general-inquiry',
  },
  
  // Priority Level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  
  // Status and Management
  status: {
    type: String,
    enum: ['new', 'read', 'in-progress', 'resolved', 'closed'],
    default: 'new',
  },
  
  // Response Information
  response: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    respondedAt: Date,
    method: {
      type: String,
      enum: ['email', 'phone', 'in-person', 'system'],
      default: 'email',
    },
  },
  
  // Additional Context
  source: {
    type: String,
    enum: ['contact-form', 'website-chat', 'email', 'phone', 'in-person', 'social-media'],
    default: 'contact-form',
  },
  
  referrerUrl: String, // Page where the message was sent from
  userAgent: String,
  ipAddress: String,
  
  // Related Records
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  relatedTrainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
  },
  relatedProgram: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
  },
  
  // Tags and Categories
  tags: [String],
  department: {
    type: String,
    enum: ['sales', 'support', 'membership', 'training', 'technical', 'general'],
    default: 'general',
  },
  
  // Follow-up Information
  followUp: {
    required: {
      type: Boolean,
      default: false,
    },
    date: Date,
    notes: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  
  // Marketing Preferences
  marketingConsent: {
    type: Boolean,
    default: false,
  },
  newsletterSubscribe: {
    type: Boolean,
    default: false,
  },
  
  // Message Metadata
  isSpam: {
    type: Boolean,
    default: false,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  
  // Attachments
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Internal Notes
  internalNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Satisfaction Rating (if applicable)
  satisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    ratedAt: Date,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
messageSchema.index({ email: 1 });
messageSchema.index({ status: 1 });
messageSchema.index({ type: 1 });
messageSchema.index({ priority: 1 });
messageSchema.index({ department: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ 'response.respondedAt': -1 });

// Text search index
messageSchema.index({
  name: 'text',
  email: 'text',
  subject: 'text',
  message: 'text',
});

// Virtual for response time (in hours)
messageSchema.virtual('responseTime').get(function() {
  if (!this.response.respondedAt) return null;
  
  const responseTime = this.response.respondedAt.getTime() - this.createdAt.getTime();
  return Math.round(responseTime / (1000 * 60 * 60 * 100)) / 100; // hours with 2 decimal places
});

// Virtual for age of message (in hours)
messageSchema.virtual('ageInHours').get(function() {
  const now = new Date();
  const age = now.getTime() - this.createdAt.getTime();
  return Math.round(age / (1000 * 60 * 60 * 100)) / 100; // hours with 2 decimal places
});

// Virtual for formatted status
messageSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'new': 'New',
    'read': 'Read',
    'in-progress': 'In Progress',
    'resolved': 'Resolved',
    'closed': 'Closed',
  };
  return statusMap[this.status] || this.status;
});

// Virtual for priority color (for UI)
messageSchema.virtual('priorityColor').get(function() {
  const colorMap = {
    'low': '#10B981',      // green
    'medium': '#F59E0B',   // yellow
    'high': '#EF4444',     // red
    'urgent': '#DC2626',   // dark red
  };
  return colorMap[this.priority] || '#6B7280';
});

// Static method to get unread messages
messageSchema.statics.getUnread = function() {
  return this.find({ status: 'new' }).sort({ createdAt: -1 });
};

// Static method to get messages by status
messageSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get messages by department
messageSchema.statics.getByDepartment = function(department) {
  return this.find({ department }).sort({ createdAt: -1 });
};

// Static method to get urgent messages
messageSchema.statics.getUrgent = function() {
  return this.find({ 
    priority: { $in: ['high', 'urgent'] },
    status: { $in: ['new', 'read', 'in-progress'] }
  }).sort({ priority: -1, createdAt: -1 });
};

// Static method to search messages
messageSchema.statics.searchMessages = function(query, filters = {}) {
  const searchCriteria = { ...filters };

  if (query) {
    searchCriteria.$text = { $search: query };
  }

  return this.find(searchCriteria).sort({ createdAt: -1 });
};

// Static method to get message statistics
messageSchema.statics.getStatistics = async function() {
  const pipeline = [
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } },
        avgResponseTime: {
          $avg: {
            $cond: [
              { $ne: ['$response.respondedAt', null] },
              { $divide: [
                { $subtract: ['$response.respondedAt', '$createdAt'] },
                1000 * 60 * 60 // Convert to hours
              ]},
              null
            ]
          }
        }
      }
    }
  ];

  const result = await this.aggregate(pipeline);
  return result[0] || {
    total: 0,
    new: 0,
    inProgress: 0,
    resolved: 0,
    urgent: 0,
    avgResponseTime: 0
  };
};

// Instance method to mark as read
messageSchema.methods.markAsRead = function() {
  if (this.status === 'new') {
    this.status = 'read';
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to respond to message
messageSchema.methods.respond = function(responseMessage, respondedBy, method = 'email') {
  this.response = {
    message: responseMessage,
    respondedBy,
    respondedAt: new Date(),
    method,
  };
  this.status = 'resolved';
  return this.save();
};

// Instance method to assign to user
messageSchema.methods.assignTo = function(userId, notes = '') {
  this.followUp.assignedTo = userId;
  this.followUp.required = true;
  this.followUp.notes = notes;
  this.status = 'in-progress';
  return this.save();
};

// Instance method to add internal note
messageSchema.methods.addInternalNote = function(note, addedBy) {
  this.internalNotes.push({
    note,
    addedBy,
  });
  return this.save();
};

// Instance method to mark as spam
messageSchema.methods.markAsSpam = function() {
  this.isSpam = true;
  this.status = 'closed';
  return this.save();
};

// Instance method to archive message
messageSchema.methods.archive = function() {
  this.isArchived = true;
  return this.save();
};

// Instance method to add satisfaction rating
messageSchema.methods.addSatisfactionRating = function(rating, comment = '') {
  this.satisfaction = {
    rating,
    comment,
    ratedAt: new Date(),
  };
  return this.save();
};

// Pre-save middleware to set priority based on keywords
messageSchema.pre('save', function(next) {
  if (this.isNew) {
    const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediately', 'critical'];
    const highKeywords = ['important', 'serious', 'problem', 'issue', 'complaint'];
    
    const messageText = (this.subject + ' ' + this.message).toLowerCase();
    
    if (urgentKeywords.some(keyword => messageText.includes(keyword))) {
      this.priority = 'urgent';
    } else if (highKeywords.some(keyword => messageText.includes(keyword))) {
      this.priority = 'high';
    }
    
    // Auto-categorize based on subject/message content
    if (messageText.includes('membership') || messageText.includes('subscription')) {
      this.department = 'membership';
    } else if (messageText.includes('trainer') || messageText.includes('personal training')) {
      this.department = 'training';
    } else if (messageText.includes('technical') || messageText.includes('bug') || messageText.includes('error')) {
      this.department = 'technical';
    } else if (messageText.includes('sales') || messageText.includes('pricing') || messageText.includes('purchase')) {
      this.department = 'sales';
    }
  }
  
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
