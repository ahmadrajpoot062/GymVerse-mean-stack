const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middlewares/auth');
const {
  getDietPlans,
  getDietPlan,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan,
  getDietPlansByTrainer
} = require('../controllers/dietPlanController');

// Validation rules
const dietPlanValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').isIn(['weight-loss', 'muscle-gain', 'maintenance', 'cutting', 'bulking'])
    .withMessage('Invalid diet plan type'),
  body('goal').notEmpty().withMessage('Goal is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('meals').isArray({ min: 1 }).withMessage('At least one meal is required'),
  body('meals.*.name').notEmpty().withMessage('Meal name is required'),
  body('meals.*.time').notEmpty().withMessage('Meal time is required'),
  body('meals.*.foods').isArray({ min: 1 }).withMessage('At least one food item is required'),
  body('meals.*.foods.*.name').notEmpty().withMessage('Food name is required'),
  body('meals.*.foods.*.quantity').notEmpty().withMessage('Food quantity is required'),
  body('totalCalories').isInt({ min: 1 }).withMessage('Total calories must be positive'),
  body('macros.protein').isFloat({ min: 0 }).withMessage('Protein must be non-negative'),
  body('macros.carbs').isFloat({ min: 0 }).withMessage('Carbs must be non-negative'),
  body('macros.fat').isFloat({ min: 0 }).withMessage('Fat must be non-negative')
];

// Public routes
router.get('/', getDietPlans);
router.get('/trainer/:trainerId', getDietPlansByTrainer);
router.get('/:id', getDietPlan);

// Protected routes
router.post('/', protect, authorize('trainer', 'admin'), dietPlanValidation, createDietPlan);
router.put('/:id', protect, authorize('trainer', 'admin'), dietPlanValidation, updateDietPlan);
router.delete('/:id', protect, authorize('trainer', 'admin'), deleteDietPlan);

module.exports = router;
