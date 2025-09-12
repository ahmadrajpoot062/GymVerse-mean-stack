/**
 * Trainer Controller for GymVerse
 * Handles trainer registration, approval, and profile management
 */

const Trainer = require('../models/Trainer');
const User = require('../models/User');
const emailService = require('../utils/emailService');
const logger = require('../utils/logger');

// @desc    Register as trainer
// @route   POST /api/trainers/register
// @access  Public
const registerTrainer = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      bio,
      specialty,
      experience,
      certifications,
      motivation,
      previousExperience,
      references,
    } = req.body;

    // Validation
    if (!name || !email || !phone || !bio || !specialty || !experience || !motivation) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields',
      });
    }

    // Check if trainer already exists
    const existingTrainer = await Trainer.findOne({ email: email.toLowerCase() });
    if (existingTrainer) {
      return res.status(400).json({
        success: false,
        error: 'Trainer already registered with this email',
      });
    }

    // Create trainer application
    const trainer = await Trainer.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      specialty: Array.isArray(specialty) ? specialty : [specialty],
      experience: {
        years: experience.years || 0,
        description: experience.description || '',
      },
      certifications: certifications || [],
      applicationData: {
        motivation: motivation.trim(),
        previousExperience: previousExperience || '',
        references: references || [],
      },
      status: 'pending',
    });

    // Send notification email to admin
    emailService.sendTrainerRegistrationNotification(trainer).catch(err => {
      logger.error('Failed to send trainer registration notification:', err);
    });

    logger.info(`New trainer application: ${trainer.email}`);

    res.status(201).json({
      success: true,
      message: 'Trainer application submitted successfully. You will be notified once your application is reviewed.',
      data: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        status: trainer.status,
      },
    });

  } catch (error) {
    logger.error('Trainer registration error:', error);
    next(error);
  }
};

// @desc    Get all approved trainers
// @route   GET /api/trainers
// @access  Public
const getTrainers = async (req, res, next) => {
  try {
    const {
      specialty,
      experience,
      rating,
      search,
      sort = '-metrics.averageRating',
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter object
    const filter = {
      status: 'approved',
      isActive: true,
    };

    if (specialty) {
      filter.specialty = { $in: Array.isArray(specialty) ? specialty : [specialty] };
    }

    if (experience) {
      filter['experience.years'] = { $gte: parseInt(experience) };
    }

    if (rating) {
      filter['metrics.averageRating'] = { $gte: parseFloat(rating) };
    }

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get trainers with pagination
    const trainers = await Trainer.find(filter)
      .select('-applicationData -reviews -user')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Trainer.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      data: trainers,
      pagination: {
        current: pageNum,
        total: totalPages,
        count: trainers.length,
        totalCount: total,
        hasNext: hasNextPage,
        hasPrev: hasPrevPage,
      },
    });

  } catch (error) {
    logger.error('Get trainers error:', error);
    next(error);
  }
};

// @desc    Get single trainer by ID
// @route   GET /api/trainers/:id
// @access  Public
const getTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({
      _id: req.params.id,
      status: 'approved',
      isActive: true,
    }).select('-applicationData -user');

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found',
      });
    }

    // Increment profile views
    trainer.incrementViews().catch(err => {
      logger.error('Failed to increment trainer views:', err);
    });

    res.status(200).json({
      success: true,
      data: trainer,
    });

  } catch (error) {
    logger.error('Get trainer error:', error);
    next(error);
  }
};

// @desc    Search trainers
// @route   GET /api/trainers/search
// @access  Public
const searchTrainers = async (req, res, next) => {
  try {
    const { q, filters = {} } = req.query;

    const trainers = await Trainer.searchTrainers(q, {
      ...filters,
      status: 'approved',
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: trainers,
      count: trainers.length,
    });

  } catch (error) {
    logger.error('Search trainers error:', error);
    next(error);
  }
};

// @desc    Get trainer dashboard data
// @route   GET /api/trainers/dashboard
// @access  Private (Trainer only)
const getTrainerDashboard = async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({ 
      user: req.user.id,
      isActive: true,
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer profile not found',
      });
    }

    // Get dashboard statistics
    const dashboardData = {
      trainer,
      stats: {
        totalClients: trainer.metrics.totalClients,
        activeClients: trainer.metrics.activeClients,
        totalSessions: trainer.metrics.totalSessions,
        averageRating: trainer.metrics.averageRating,
        totalReviews: trainer.metrics.totalReviews,
        profileViews: trainer.metrics.profileViews,
        contactRequests: trainer.metrics.contactRequests,
      },
      recentReviews: trainer.reviews.slice(-5),
      certificationStatus: {
        total: trainer.certifications.length,
        expiring: trainer.certifications.filter(cert => {
          if (!cert.expiryDate) return false;
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
          return cert.expiryDate <= thirtyDaysFromNow;
        }).length,
      },
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
    });

  } catch (error) {
    logger.error('Get trainer dashboard error:', error);
    next(error);
  }
};

// @desc    Update trainer profile
// @route   PUT /api/trainers/profile
// @access  Private (Trainer only)
const updateTrainerProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'bio',
      'specialty',
      'experience',
      'certifications',
      'socialMedia',
      'services',
      'availability',
      'settings',
    ];

    const updates = {};
    
    // Filter allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const trainer = await Trainer.findOneAndUpdate(
      { user: req.user.id },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer profile not found',
      });
    }

    logger.info(`Trainer profile updated: ${trainer.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: trainer,
    });

  } catch (error) {
    logger.error('Update trainer profile error:', error);
    next(error);
  }
};

// @desc    Upload trainer video
// @route   POST /api/trainers/videos
// @access  Private (Trainer only)
const uploadVideo = async (req, res, next) => {
  try {
    const { title, description, url, category, thumbnail, duration } = req.body;

    if (!title || !url) {
      return res.status(400).json({
        success: false,
        error: 'Title and video URL are required',
      });
    }

    const trainer = await Trainer.findOne({ user: req.user.id });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer profile not found',
      });
    }

    // Add video to trainer's videos array
    trainer.videos.push({
      title: title.trim(),
      description: description || '',
      url: url.trim(),
      category: category || 'workout-demo',
      thumbnail: thumbnail || '',
      duration: duration || 0,
    });

    await trainer.save();

    logger.info(`Video uploaded by trainer: ${trainer.email}`);

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: trainer.videos[trainer.videos.length - 1],
    });

  } catch (error) {
    logger.error('Upload video error:', error);
    next(error);
  }
};

// @desc    Delete trainer video
// @route   DELETE /api/trainers/videos/:videoId
// @access  Private (Trainer only)
const deleteVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;

    const trainer = await Trainer.findOne({ user: req.user.id });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer profile not found',
      });
    }

    // Remove video from array
    trainer.videos = trainer.videos.filter(video => video._id.toString() !== videoId);
    await trainer.save();

    logger.info(`Video deleted by trainer: ${trainer.email}`);

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
    });

  } catch (error) {
    logger.error('Delete video error:', error);
    next(error);
  }
};

// @desc    Add review to trainer
// @route   POST /api/trainers/:id/reviews
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { id: trainerId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a rating between 1 and 5',
      });
    }

    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found',
      });
    }

    // Check if user has already reviewed this trainer
    const existingReview = trainer.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this trainer',
      });
    }

    await trainer.addReview(req.user.id, rating, comment);

    logger.info(`Review added for trainer: ${trainer.email} by user: ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
    });

  } catch (error) {
    logger.error('Add review error:', error);
    next(error);
  }
};

// @desc    Contact trainer
// @route   POST /api/trainers/:id/contact
// @access  Private
const contactTrainer = async (req, res, next) => {
  try {
    const { message, subject } = req.body;
    const { id: trainerId } = req.params;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found',
      });
    }

    // Increment contact requests metric
    trainer.incrementContactRequests().catch(err => {
      logger.error('Failed to increment contact requests:', err);
    });

    // TODO: Implement actual messaging system or email notification
    logger.info(`Contact request for trainer: ${trainer.email} from user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Contact request sent successfully. The trainer will get back to you soon.',
    });

  } catch (error) {
    logger.error('Contact trainer error:', error);
    next(error);
  }
};

// @desc    Get trainer application status
// @route   GET /api/trainers/application-status/:email
// @access  Public
const getApplicationStatus = async (req, res, next) => {
  try {
    const { email } = req.params;

    const trainer = await Trainer.findOne({ 
      email: email.toLowerCase() 
    }).select('status approvalDate rejectionReason');

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'No trainer application found with this email',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        status: trainer.status,
        statusDisplay: trainer.statusDisplay,
        approvalDate: trainer.approvalDate,
        rejectionReason: trainer.rejectionReason,
      },
    });

  } catch (error) {
    logger.error('Get application status error:', error);
    next(error);
  }
};

module.exports = {
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
};
