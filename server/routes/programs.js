/**
 * Program Routes for GymVerse
 * Handles training programs CRUD and interactions
 */

const express = require('express');
const { body } = require('express-validator');
const {
  getPrograms,
  getProgram,
  searchPrograms,
  getProgramsByCategory,
  getFeaturedPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  addReview,
  enrollProgram,
  getTrainerPrograms,
} = require('../controllers/programController');

const { protect, authorize, optionalAuth } = require('../middlewares/auth');

const router = express.Router();

// Validation rules
const programValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Description must be between 50 and 2000 characters'),
  body('category')
    .isIn([
      'strength-training',
      'cardio-fitness',
      'weight-loss',
      'muscle-building',
      'crossfit',
      'yoga',
      'pilates',
      'hiit',
      'bodybuilding',
      'powerlifting',
      'functional-training',
      'flexibility',
      'sports-specific',
      'rehabilitation',
      'dance-fitness',
      'martial-arts',
      'senior-fitness',
      'youth-fitness',
      'prenatal-fitness'
    ])
    .withMessage('Invalid program category'),
  body('difficulty')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),
  body('duration.weeks')
    .isInt({ min: 1, max: 52 })
    .withMessage('Duration must be between 1 and 52 weeks'),
  body('duration.sessionsPerWeek')
    .isInt({ min: 1, max: 7 })
    .withMessage('Sessions per week must be between 1 and 7'),
  body('duration.sessionDuration')
    .isInt({ min: 15, max: 180 })
    .withMessage('Session duration must be between 15 and 180 minutes'),
  body('pricing.type')
    .isIn(['free', 'one-time', 'subscription', 'per-session'])
    .withMessage('Invalid pricing type'),
  body('pricing.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
];

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
];

// Public routes
router.get('/', optionalAuth, getPrograms);
router.get('/search', searchPrograms);
router.get('/featured', getFeaturedPrograms);
router.get('/category/:category', getProgramsByCategory);
router.get('/trainer/:trainerId', getTrainerPrograms);
router.get('/:id', getProgram);

// Protected routes
router.use(protect);

// Create, update, delete programs (Trainer/Admin only)
router.post('/', authorize('trainer', 'admin'), programValidation, createProgram);
router.put('/:id', authorize('trainer', 'admin'), updateProgram);
router.delete('/:id', authorize('trainer', 'admin'), deleteProgram);

// User interaction routes
router.post('/:id/reviews', reviewValidation, addReview);
router.post('/:id/enroll', enrollProgram);

module.exports = router;
