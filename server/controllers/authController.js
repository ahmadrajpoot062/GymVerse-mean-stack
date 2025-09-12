/**
 * Authentication Controller for GymVerse
 * Handles user registration, login, profile management
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../utils/emailService');
const logger = require('../utils/logger');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res, message = '') => {
  const token = generateToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        isEmailVerified: user.isEmailVerified,
        membership: user.membership,
      },
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password',
      });
    }

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email',
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long',
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role === 'admin' ? 'user' : role, // Prevent admin creation via registration
    });

    // Generate email verification token
    const emailToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(emailToken)
      .digest('hex');
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send welcome email (don't wait for it)
    emailService.sendWelcomeEmail(user.email, user.name).catch(err => {
      logger.error('Failed to send welcome email:', err);
    });

    logger.info(`New user registered: ${user.email}`);

    sendTokenResponse(user, 201, res, 'User registered successfully');

  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Check for user and include password in select
    const user = await User.findByEmail(email).select('+password +loginAttempts +lockUntil');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        error: 'Account temporarily locked due to too many failed login attempts',
        lockUntil: user.lockUntil,
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${user.email}`);

    sendTokenResponse(user, 200, res, 'Login successful');

  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });

  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate([
      {
        path: 'favoritePrograms',
        select: 'title description pricing trainer',
        populate: {
          path: 'trainer',
          select: 'name profileImage',
        },
      },
      {
        path: 'favoriteTrainers',
        select: 'name profileImage specialty experience.years',
      },
      {
        path: 'membership.plan',
        select: 'name type pricing features',
      },
    ]);

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    logger.error('Get me error:', error);
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'profile.bio',
      'profile.phone',
      'profile.dateOfBirth',
      'profile.gender',
      'profile.address',
      'profile.fitnessGoals',
      'profile.experienceLevel',
      'profile.medicalConditions',
      'profile.emergencyContact',
      'preferences',
    ];

    const updates = {};
    
    // Filter allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    logger.info(`User profile updated: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current and new password',
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect',
      });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long',
      });
    }

    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    sendTokenResponse(user, 200, res, 'Password updated successfully');

  } catch (error) {
    logger.error('Update password error:', error);
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email address',
      });
    }

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No user found with that email address',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email (implement email service)
    try {
      // TODO: Implement password reset email
      logger.info(`Password reset requested for: ${user.email}`);
      logger.info(`Reset URL: ${resetUrl}`);
      
      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      logger.error('Email could not be sent:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Email could not be sent',
      });
    }

  } catch (error) {
    logger.error('Forgot password error:', error);
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide new password',
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long',
      });
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    logger.info(`Password reset for user: ${user.email}`);

    sendTokenResponse(user, 200, res, 'Password reset successful');

  } catch (error) {
    logger.error('Reset password error:', error);
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res, next) => {
  try {
    // Get hashed token
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token',
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    logger.info(`Email verified for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });

  } catch (error) {
    logger.error('Email verification error:', error);
    next(error);
  }
};

// @desc    Add program to favorites
// @route   POST /api/auth/favorites/programs/:programId
// @access  Private
const addFavoriteProgram = async (req, res, next) => {
  try {
    const { programId } = req.params;

    const user = await User.findById(req.user.id);
    
    if (user.favoritePrograms.includes(programId)) {
      return res.status(400).json({
        success: false,
        error: 'Program already in favorites',
      });
    }

    user.favoritePrograms.push(programId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Program added to favorites',
    });

  } catch (error) {
    logger.error('Add favorite program error:', error);
    next(error);
  }
};

// @desc    Remove program from favorites
// @route   DELETE /api/auth/favorites/programs/:programId
// @access  Private
const removeFavoriteProgram = async (req, res, next) => {
  try {
    const { programId } = req.params;

    const user = await User.findById(req.user.id);
    user.favoritePrograms = user.favoritePrograms.filter(
      id => id.toString() !== programId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Program removed from favorites',
    });

  } catch (error) {
    logger.error('Remove favorite program error:', error);
    next(error);
  }
};

// @desc    Add trainer to favorites
// @route   POST /api/auth/favorites/trainers/:trainerId
// @access  Private
const addFavoriteTrainer = async (req, res, next) => {
  try {
    const { trainerId } = req.params;

    const user = await User.findById(req.user.id);
    
    if (user.favoriteTrainers.includes(trainerId)) {
      return res.status(400).json({
        success: false,
        error: 'Trainer already in favorites',
      });
    }

    user.favoriteTrainers.push(trainerId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Trainer added to favorites',
    });

  } catch (error) {
    logger.error('Add favorite trainer error:', error);
    next(error);
  }
};

// @desc    Remove trainer from favorites
// @route   DELETE /api/auth/favorites/trainers/:trainerId
// @access  Private
const removeFavoriteTrainer = async (req, res, next) => {
  try {
    const { trainerId } = req.params;

    const user = await User.findById(req.user.id);
    user.favoriteTrainers = user.favoriteTrainers.filter(
      id => id.toString() !== trainerId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Trainer removed from favorites',
    });

  } catch (error) {
    logger.error('Remove favorite trainer error:', error);
    next(error);
  }
};

module.exports = {
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
};
