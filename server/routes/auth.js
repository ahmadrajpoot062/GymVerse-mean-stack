/**
 * Authentication Routes for GymVerse
 * Handles user registration, login, and profile management
 */

const express = require('express');
const { body } = require('express-validator');
const { 
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  addFavoriteProgram,
  removeFavoriteProgram,
  addFavoriteTrainer,
  removeFavoriteTrainer,
} = require('../controllers/authController');

const { protect, loginRateLimit } = require('../middlewares/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const passwordValidation = [
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginRateLimit, loginValidation, login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/password', passwordValidation, updatePassword);

// Favorites management
router.post('/favorites/programs/:programId', addFavoriteProgram);
router.delete('/favorites/programs/:programId', removeFavoriteProgram);
router.post('/favorites/trainers/:trainerId', addFavoriteTrainer);
router.delete('/favorites/trainers/:trainerId', removeFavoriteTrainer);

module.exports = router;
