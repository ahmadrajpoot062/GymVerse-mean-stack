const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['fitness', 'nutrition', 'wellness', 'training', 'lifestyle', 'news']
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    type: String,
    default: ''
  },
  images: [String],
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true,
        maxlength: 500
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Performance indexes (excluding slug which has unique: true)
blogSchema.index({ category: 1, published: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ tags: 1 });

// Pre-save middleware
blogSchema.pre('save', function(next) {
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
