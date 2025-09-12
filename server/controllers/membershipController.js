/**
 * Membership Controller for GymVerse
 * Handles membership plans and subscriptions
 */

const Membership = require('../models/Membership');
const logger = require('../utils/logger');

// @desc    Get all active memberships
// @route   GET /api/memberships
// @access  Public
const getMemberships = async (req, res, next) => {
  try {
    const memberships = await Membership.getActive();

    res.status(200).json({
      success: true,
      data: memberships,
      count: memberships.length,
    });

  } catch (error) {
    logger.error('Get memberships error:', error);
    next(error);
  }
};

// @desc    Get single membership
// @route   GET /api/memberships/:id
// @access  Public
const getMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findOne({
      _id: req.params.id,
      'settings.isActive': true,
      'settings.isVisible': true,
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        error: 'Membership plan not found',
      });
    }

    res.status(200).json({
      success: true,
      data: membership,
    });

  } catch (error) {
    logger.error('Get membership error:', error);
    next(error);
  }
};

// @desc    Create membership plan
// @route   POST /api/memberships
// @access  Private (Admin only)
const createMembership = async (req, res, next) => {
  try {
    const membership = await Membership.create({
      ...req.body,
      createdBy: req.user.id,
    });

    logger.info(`Membership plan created: ${membership.name} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Membership plan created successfully',
      data: membership,
    });

  } catch (error) {
    logger.error('Create membership error:', error);
    next(error);
  }
};

// @desc    Update membership plan
// @route   PUT /api/memberships/:id
// @access  Private (Admin only)
const updateMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        lastModifiedBy: req.user.id,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        error: 'Membership plan not found',
      });
    }

    logger.info(`Membership plan updated: ${membership.name} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Membership plan updated successfully',
      data: membership,
    });

  } catch (error) {
    logger.error('Update membership error:', error);
    next(error);
  }
};

// @desc    Delete membership plan
// @route   DELETE /api/memberships/:id
// @access  Private (Admin only)
const deleteMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findById(req.params.id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        error: 'Membership plan not found',
      });
    }

    membership.settings.isActive = false;
    await membership.save();

    logger.info(`Membership plan deleted: ${membership.name} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Membership plan deleted successfully',
    });

  } catch (error) {
    logger.error('Delete membership error:', error);
    next(error);
  }
};

module.exports = {
  getMemberships,
  getMembership,
  createMembership,
  updateMembership,
  deleteMembership,
};
