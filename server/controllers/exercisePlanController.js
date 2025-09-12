const ExercisePlan = require('../models/ExercisePlan');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// @desc    Get all exercise plans
// @route   GET /api/exercise-plans
// @access  Public
const getExercisePlans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by difficulty
    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty;
    }
    
    // Filter by duration range
    if (req.query.minDuration || req.query.maxDuration) {
      query.duration = {};
      if (req.query.minDuration) query.duration.$gte = parseInt(req.query.minDuration);
      if (req.query.maxDuration) query.duration.$lte = parseInt(req.query.maxDuration);
    }

    const exercisePlans = await ExercisePlan.find(query)
      .populate('trainer', 'name email profileImage')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await ExercisePlan.countDocuments(query);

    res.json({
      success: true,
      data: exercisePlans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get exercise plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single exercise plan
// @route   GET /api/exercise-plans/:id
// @access  Public
const getExercisePlan = async (req, res) => {
  try {
    const exercisePlan = await ExercisePlan.findById(req.params.id)
      .populate('trainer', 'name email profileImage bio rating');

    if (!exercisePlan) {
      return res.status(404).json({
        success: false,
        message: 'Exercise plan not found'
      });
    }

    res.json({
      success: true,
      data: exercisePlan
    });
  } catch (error) {
    logger.error('Get exercise plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create exercise plan
// @route   POST /api/exercise-plans
// @access  Private (Trainer/Admin)
const createExercisePlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const exercisePlan = new ExercisePlan({
      ...req.body,
      trainer: req.user.id
    });

    await exercisePlan.save();
    await exercisePlan.populate('trainer', 'name email profileImage');

    logger.info(`Exercise plan created: ${exercisePlan.title} by trainer ${req.user.id}`);

    res.status(201).json({
      success: true,
      data: exercisePlan
    });
  } catch (error) {
    logger.error('Create exercise plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update exercise plan
// @route   PUT /api/exercise-plans/:id
// @access  Private (Owner/Admin)
const updateExercisePlan = async (req, res) => {
  try {
    const exercisePlan = await ExercisePlan.findById(req.params.id);

    if (!exercisePlan) {
      return res.status(404).json({
        success: false,
        message: 'Exercise plan not found'
      });
    }

    // Check ownership or admin
    if (exercisePlan.trainer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this exercise plan'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const updatedExercisePlan = await ExercisePlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('trainer', 'name email profileImage');

    logger.info(`Exercise plan updated: ${updatedExercisePlan.title} by user ${req.user.id}`);

    res.json({
      success: true,
      data: updatedExercisePlan
    });
  } catch (error) {
    logger.error('Update exercise plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete exercise plan
// @route   DELETE /api/exercise-plans/:id
// @access  Private (Owner/Admin)
const deleteExercisePlan = async (req, res) => {
  try {
    const exercisePlan = await ExercisePlan.findById(req.params.id);

    if (!exercisePlan) {
      return res.status(404).json({
        success: false,
        message: 'Exercise plan not found'
      });
    }

    // Check ownership or admin
    if (exercisePlan.trainer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this exercise plan'
      });
    }

    await ExercisePlan.findByIdAndDelete(req.params.id);

    logger.info(`Exercise plan deleted: ${exercisePlan.title} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Exercise plan deleted successfully'
    });
  } catch (error) {
    logger.error('Delete exercise plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get exercise plans by trainer
// @route   GET /api/exercise-plans/trainer/:trainerId
// @access  Public
const getExercisePlansByTrainer = async (req, res) => {
  try {
    const exercisePlans = await ExercisePlan.find({ trainer: req.params.trainerId })
      .populate('trainer', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: exercisePlans
    });
  } catch (error) {
    logger.error('Get exercise plans by trainer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getExercisePlans,
  getExercisePlan,
  createExercisePlan,
  updateExercisePlan,
  deleteExercisePlan,
  getExercisePlansByTrainer
};
