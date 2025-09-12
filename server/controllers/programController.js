/**
 * Program Controller for GymVerse
 * Handles training programs CRUD operations
 */

const Program = require('../models/Program');
const Trainer = require('../models/Trainer');
const logger = require('../utils/logger');

// @desc    Get all published programs
// @route   GET /api/programs
// @access  Public
const getPrograms = async (req, res, next) => {
  try {
    const {
      category,
      difficulty,
      trainer,
      priceRange,
      search,
      sort = '-publishedDate',
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter object
    const filter = {
      status: 'published',
      isActive: true,
      'settings.isPublic': true,
    };

    if (category) {
      filter.category = { $in: Array.isArray(category) ? category : [category] };
    }

    if (difficulty) {
      filter.difficulty = { $in: Array.isArray(difficulty) ? difficulty : [difficulty] };
    }

    if (trainer) {
      filter.trainer = trainer;
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filter['pricing.amount'] = { $gte: min, $lte: max };
    }

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get programs with pagination
    const programs = await Program.find(filter)
      .populate('trainer', 'name profileImage specialty experience.years metrics.averageRating')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Program.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      data: programs,
      pagination: {
        current: pageNum,
        total: totalPages,
        count: programs.length,
        totalCount: total,
        hasNext: hasNextPage,
        hasPrev: hasPrevPage,
      },
    });

  } catch (error) {
    logger.error('Get programs error:', error);
    next(error);
  }
};

// @desc    Get single program by ID
// @route   GET /api/programs/:id
// @access  Public
const getProgram = async (req, res, next) => {
  try {
    const program = await Program.findOne({
      _id: req.params.id,
      status: 'published',
      isActive: true,
      'settings.isPublic': true,
    }).populate('trainer', 'name profileImage specialty experience bio socialMedia metrics');

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found',
      });
    }

    // Increment program views
    program.incrementViews().catch(err => {
      logger.error('Failed to increment program views:', err);
    });

    res.status(200).json({
      success: true,
      data: program,
    });

  } catch (error) {
    logger.error('Get program error:', error);
    next(error);
  }
};

// @desc    Search programs
// @route   GET /api/programs/search
// @access  Public
const searchPrograms = async (req, res, next) => {
  try {
    const { q, filters = {} } = req.query;

    const programs = await Program.searchPrograms(q, {
      ...filters,
      status: 'published',
      isActive: true,
      'settings.isPublic': true,
    }).populate('trainer', 'name profileImage specialty');

    res.status(200).json({
      success: true,
      data: programs,
      count: programs.length,
    });

  } catch (error) {
    logger.error('Search programs error:', error);
    next(error);
  }
};

// @desc    Get programs by category
// @route   GET /api/programs/category/:category
// @access  Public
const getProgramsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 6 } = req.query;

    const programs = await Program.find({
      category,
      status: 'published',
      isActive: true,
      'settings.isPublic': true,
    })
      .populate('trainer', 'name profileImage specialty')
      .sort('-metrics.averageRating')
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: programs,
      count: programs.length,
    });

  } catch (error) {
    logger.error('Get programs by category error:', error);
    next(error);
  }
};

// @desc    Get featured programs
// @route   GET /api/programs/featured
// @access  Public
const getFeaturedPrograms = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const programs = await Program.find({
      status: 'published',
      isActive: true,
      'settings.isPublic': true,
      'metrics.averageRating': { $gte: 4.0 },
      'metrics.enrollments': { $gte: 10 },
    })
      .populate('trainer', 'name profileImage specialty')
      .sort('-metrics.averageRating -metrics.enrollments')
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: programs,
      count: programs.length,
    });

  } catch (error) {
    logger.error('Get featured programs error:', error);
    next(error);
  }
};

// @desc    Create new program
// @route   POST /api/programs
// @access  Private (Trainer/Admin only)
const createProgram = async (req, res, next) => {
  try {
    const {
      title,
      description,
      shortDescription,
      category,
      difficulty,
      duration,
      pricing,
      exercises,
      goals,
      requirements,
      images,
      tags,
    } = req.body;

    // Validation
    if (!title || !description || !category || !difficulty || !duration || !pricing) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields',
      });
    }

    // For trainers, get their trainer profile
    let trainerId;
    if (req.user.role === 'trainer') {
      const trainerProfile = await Trainer.findOne({ user: req.user.id });
      if (!trainerProfile || trainerProfile.status !== 'approved') {
        return res.status(403).json({
          success: false,
          error: 'Only approved trainers can create programs',
        });
      }
      trainerId = trainerProfile._id;
    } else if (req.user.role === 'admin' && req.body.trainer) {
      trainerId = req.body.trainer;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Trainer information required',
      });
    }

    const program = await Program.create({
      title: title.trim(),
      description: description.trim(),
      shortDescription: shortDescription?.trim(),
      category,
      difficulty,
      trainer: trainerId,
      duration,
      pricing,
      exercises: exercises || [],
      goals: goals || [],
      requirements: requirements || {},
      images: images || [],
      tags: tags || [],
      status: req.user.role === 'admin' ? 'published' : 'draft',
      publishedDate: req.user.role === 'admin' ? new Date() : undefined,
    });

    await program.populate('trainer', 'name profileImage specialty');

    logger.info(`Program created: ${program.title} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Program created successfully',
      data: program,
    });

  } catch (error) {
    logger.error('Create program error:', error);
    next(error);
  }
};

// @desc    Update program
// @route   PUT /api/programs/:id
// @access  Private (Trainer/Admin only)
const updateProgram = async (req, res, next) => {
  try {
    let program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found',
      });
    }

    // Check ownership (trainers can only edit their own programs)
    if (req.user.role === 'trainer') {
      const trainerProfile = await Trainer.findOne({ user: req.user.id });
      if (!trainerProfile || program.trainer.toString() !== trainerProfile._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this program',
        });
      }
    }

    const allowedFields = [
      'title',
      'description',
      'shortDescription',
      'category',
      'difficulty',
      'duration',
      'pricing',
      'exercises',
      'goals',
      'requirements',
      'images',
      'tags',
      'settings',
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Update last modified date
    updates.lastUpdated = new Date();

    program = await Program.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate('trainer', 'name profileImage specialty');

    logger.info(`Program updated: ${program.title} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Program updated successfully',
      data: program,
    });

  } catch (error) {
    logger.error('Update program error:', error);
    next(error);
  }
};

// @desc    Delete program
// @route   DELETE /api/programs/:id
// @access  Private (Trainer/Admin only)
const deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found',
      });
    }

    // Check ownership (trainers can only delete their own programs)
    if (req.user.role === 'trainer') {
      const trainerProfile = await Trainer.findOne({ user: req.user.id });
      if (!trainerProfile || program.trainer.toString() !== trainerProfile._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this program',
        });
      }
    }

    // Soft delete by setting isActive to false
    program.isActive = false;
    await program.save();

    logger.info(`Program deleted: ${program.title} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Program deleted successfully',
    });

  } catch (error) {
    logger.error('Delete program error:', error);
    next(error);
  }
};

// @desc    Add review to program
// @route   POST /api/programs/:id/reviews
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { id: programId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a rating between 1 and 5',
      });
    }

    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found',
      });
    }

    // Check if user has already reviewed this program
    const existingReview = program.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this program',
      });
    }

    await program.addReview(req.user.id, rating, comment);

    logger.info(`Review added for program: ${program.title} by user: ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
    });

  } catch (error) {
    logger.error('Add review error:', error);
    next(error);
  }
};

// @desc    Enroll in program
// @route   POST /api/programs/:id/enroll
// @access  Private
const enrollProgram = async (req, res, next) => {
  try {
    const { id: programId } = req.params;

    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found',
      });
    }

    // Check if program is available for enrollment
    if (program.status !== 'published' || !program.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Program is not available for enrollment',
      });
    }

    // Increment enrollment count
    await program.incrementEnrollments();

    // TODO: Implement actual enrollment logic (payment, user programs, etc.)
    logger.info(`User enrolled in program: ${program.title} by user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in program',
    });

  } catch (error) {
    logger.error('Enroll program error:', error);
    next(error);
  }
};

// @desc    Get trainer's programs
// @route   GET /api/programs/trainer/:trainerId
// @access  Public
const getTrainerPrograms = async (req, res, next) => {
  try {
    const { trainerId } = req.params;
    const { status = 'published' } = req.query;

    const filter = {
      trainer: trainerId,
      isActive: true,
    };

    if (status) {
      filter.status = status;
    }

    const programs = await Program.find(filter)
      .sort('-publishedDate')
      .lean();

    res.status(200).json({
      success: true,
      data: programs,
      count: programs.length,
    });

  } catch (error) {
    logger.error('Get trainer programs error:', error);
    next(error);
  }
};

module.exports = {
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
};
