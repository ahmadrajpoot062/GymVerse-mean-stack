const DietPlan = require('../models/DietPlan');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// @desc    Get all diet plans
// @route   GET /api/diet-plans
// @access  Public
const getDietPlans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by goal
    if (req.query.goal) {
      query.goal = req.query.goal;
    }
    
    // Filter by dietary restrictions
    if (req.query.restrictions) {
      const restrictions = Array.isArray(req.query.restrictions) 
        ? req.query.restrictions 
        : [req.query.restrictions];
      query.dietaryRestrictions = { $in: restrictions };
    }

    const dietPlans = await DietPlan.find(query)
      .populate('trainer', 'name email profileImage')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await DietPlan.countDocuments(query);

    res.json({
      success: true,
      data: dietPlans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get diet plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single diet plan
// @route   GET /api/diet-plans/:id
// @access  Public
const getDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id)
      .populate('trainer', 'name email profileImage bio rating');

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    res.json({
      success: true,
      data: dietPlan
    });
  } catch (error) {
    logger.error('Get diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create diet plan
// @route   POST /api/diet-plans
// @access  Private (Trainer/Admin)
const createDietPlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const dietPlan = new DietPlan({
      ...req.body,
      trainer: req.user.id
    });

    await dietPlan.save();
    await dietPlan.populate('trainer', 'name email profileImage');

    logger.info(`Diet plan created: ${dietPlan.title} by trainer ${req.user.id}`);

    res.status(201).json({
      success: true,
      data: dietPlan
    });
  } catch (error) {
    logger.error('Create diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update diet plan
// @route   PUT /api/diet-plans/:id
// @access  Private (Owner/Admin)
const updateDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    // Check ownership or admin
    if (dietPlan.trainer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this diet plan'
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

    const updatedDietPlan = await DietPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('trainer', 'name email profileImage');

    logger.info(`Diet plan updated: ${updatedDietPlan.title} by user ${req.user.id}`);

    res.json({
      success: true,
      data: updatedDietPlan
    });
  } catch (error) {
    logger.error('Update diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete diet plan
// @route   DELETE /api/diet-plans/:id
// @access  Private (Owner/Admin)
const deleteDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    // Check ownership or admin
    if (dietPlan.trainer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this diet plan'
      });
    }

    await DietPlan.findByIdAndDelete(req.params.id);

    logger.info(`Diet plan deleted: ${dietPlan.title} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Diet plan deleted successfully'
    });
  } catch (error) {
    logger.error('Delete diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get diet plans by trainer
// @route   GET /api/diet-plans/trainer/:trainerId
// @access  Public
const getDietPlansByTrainer = async (req, res) => {
  try {
    const dietPlans = await DietPlan.find({ trainer: req.params.trainerId })
      .populate('trainer', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: dietPlans
    });
  } catch (error) {
    logger.error('Get diet plans by trainer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getDietPlans,
  getDietPlan,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan,
  getDietPlansByTrainer
};
