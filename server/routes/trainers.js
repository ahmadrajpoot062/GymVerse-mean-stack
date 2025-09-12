/**
 * Trainer Routes for GymVerse
 * Handles trainer registration, profiles, and interactions
 */

const express = require('express');
const { body } = require('express-validator');
const {
  registerTrainer,
  getTrainers,
  getTrainer,
  searchTrainers,
  getTrainerDashboard,
  updateTrainerProfile,
  uploadVideo,
  deleteVideo,
  addReview,
  contactTrainer,
  getApplicationStatus,
} = require('../controllers/trainerController');

const { protect, authorize, optionalAuth } = require('../middlewares/auth');

const router = express.Router();

// Validation rules
const trainerRegistrationValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('bio')
    .trim()
    .isLength({ min: 50, max: 1000 })
    .withMessage('Bio must be between 50 and 1000 characters'),
  body('specialty')
    .isArray({ min: 1 })
    .withMessage('Please select at least one specialty'),
  body('experience.years')
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be between 0 and 50 years'),
  body('motivation')
    .trim()
    .isLength({ min: 100, max: 1000 })
    .withMessage('Motivation must be between 100 and 1000 characters'),
];

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
];

const videoValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('url')
    .isURL()
    .withMessage('Please provide a valid video URL'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn([
      'workout-demo',
      'technique-tutorial',
      'motivation',
      'nutrition-tips',
      'client-testimonial',
      'exercise-form',
      'equipment-review',
      'program-preview'
    ])
    .withMessage('Invalid video category'),
];

const contactValidation = [
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),
];

// Public routes
router.post('/register', trainerRegistrationValidation, registerTrainer);
router.get('/', optionalAuth, getTrainers);
router.get('/search', searchTrainers);
router.get('/application-status/:email', getApplicationStatus);
router.get('/:id', getTrainer);

// Protected routes
router.use(protect);

// Trainer-specific routes (require trainer role)
router.get('/dashboard/data', authorize('trainer'), getTrainerDashboard);
router.put('/profile', authorize('trainer'), updateTrainerProfile);
router.post('/videos', authorize('trainer'), videoValidation, uploadVideo);
router.delete('/videos/:videoId', authorize('trainer'), deleteVideo);

// User interaction routes
router.post('/:id/reviews', reviewValidation, addReview);
router.post('/:id/contact', contactValidation, contactTrainer);

module.exports = router;
