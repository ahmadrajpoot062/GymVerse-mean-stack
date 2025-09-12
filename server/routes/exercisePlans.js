const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middlewares/auth');
const {
  getExercisePlans,
  getExercisePlan,
  createExercisePlan,
  updateExercisePlan,
  deleteExercisePlan,
  getExercisePlansByTrainer
} = require('../controllers/exercisePlanController');

// Validation rules
const exercisePlanValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['strength', 'cardio', 'flexibility', 'sports', 'rehabilitation', 'weight-loss'])
    .withMessage('Invalid category'),
  body('difficulty').isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('exercises').isArray({ min: 1 }).withMessage('At least one exercise is required'),
  body('exercises.*.name').notEmpty().withMessage('Exercise name is required'),
  body('exercises.*.type').isIn(['cardio', 'strength', 'flexibility', 'plyometric'])
    .withMessage('Invalid exercise type'),
  body('exercises.*.duration').optional().isInt({ min: 1 }).withMessage('Exercise duration must be positive'),
  body('exercises.*.sets').optional().isInt({ min: 1 }).withMessage('Sets must be positive'),
  body('exercises.*.reps').optional().isInt({ min: 1 }).withMessage('Reps must be positive')
];

// Public routes
router.get('/', getExercisePlans);
router.get('/trainer/:trainerId', getExercisePlansByTrainer);
router.get('/:id', getExercisePlan);

// Protected routes
router.post('/', protect, authorize('trainer', 'admin'), exercisePlanValidation, createExercisePlan);
router.put('/:id', protect, authorize('trainer', 'admin'), exercisePlanValidation, updateExercisePlan);
router.delete('/:id', protect, authorize('trainer', 'admin'), deleteExercisePlan);

module.exports = router;
