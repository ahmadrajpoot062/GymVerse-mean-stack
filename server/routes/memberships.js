const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middlewares/auth');
const {
  getMemberships,
  getMembership,
  createMembership,
  updateMembership,
  deleteMembership,
  getUserMemberships
} = require('../controllers/membershipController');

// Validation rules
const membershipValidation = [
  body('name').notEmpty().withMessage('Membership name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('features').isArray({ min: 1 }).withMessage('At least one feature is required')
];

// Public routes
router.get('/', getMemberships);
router.get('/:id', getMembership);

// Protected routes
router.post('/', protect, authorize('admin'), membershipValidation, createMembership);
router.put('/:id', protect, authorize('admin'), membershipValidation, updateMembership);
router.delete('/:id', protect, authorize('admin'), deleteMembership);

// User specific routes
router.get('/user/my-memberships', protect, getUserMemberships);

module.exports = router;
