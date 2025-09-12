/**
 * GymVerse Server - Main Entry Point
 * A complete MEAN stack gym training platform backend
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import colors for consistent theming
const { colors } = require('../client/colors');

// Import routes
const authRoutes = require('./routes/auth');
const trainerRoutes = require('./routes/trainers');
const programRoutes = require('./routes/programs');
const exercisePlanRoutes = require('./routes/exercisePlans');
const dietPlanRoutes = require('./routes/dietPlans');
const messageRoutes = require('./routes/messages');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/uploads');
const blogRoutes = require('./routes/blog');
const referralRoutes = require('./routes/referral');
const newsletterRoutes = require('./routes/newsletter');

// Import middlewares
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(limiter);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https:', 'http:'],
    },
  },
}));

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:4200',
      'http://localhost:4200',
      'https://gymverse.vercel.app', // Production frontend
      'https://gymverse.netlify.app', // Alternative production frontend
    ];
    
    // Allow requests with no origin (mobile apps, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static files (for uploaded content)
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'GymVerse API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: require('./package.json').version,
    theme: {
      primary: colors.primary.red,
      secondary: colors.secondary.black,
      accent: colors.primary.white
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/exercise-plans', exercisePlanRoutes);
app.use('/api/diet-plans', dietPlanRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api', blogRoutes);
app.use('/api', referralRoutes);
app.use('/api', newsletterRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to GymVerse API! 🏋️‍♂️',
    tagline: 'Train Hard, Live Strong',
    documentation: '/api/docs',
    health: '/health',
    version: require('./package.json').version,
    endpoints: {
      auth: '/api/auth',
      trainers: '/api/trainers',
      programs: '/api/programs',
      exercisePlans: '/api/exercise-plans',
      dietPlans: '/api/diet-plans',
      messages: '/api/messages',
      admin: '/api/admin',
      uploads: '/api/uploads',
      blog: '/api/blogs',
      referral: '/api/referral',
      newsletter: '/api/newsletter'
    }
  });
});

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      '/api/auth',
      '/api/trainers',
      '/api/programs',
      '/api/exercise-plans',
      '/api/diet-plans',
      '/api/messages',
      '/api/admin',
      '/api/uploads',
      '/api/blogs',
      '/api/referral',
      '/api/newsletter'
    ]
  });
});

// Global error handler
app.use(errorHandler);

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI || 'mongodb://localhost:27017/gymverse';

    const conn = await mongoose.connect(mongoURI);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      logger.info(`🏋️ GymVerse Server running on port ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🎨 Theme: Red-White-Black (${colors.primary.red})`);
      logger.info(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:4200'}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Promise Rejection:', err);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
