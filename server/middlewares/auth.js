/**
 * Authentication Middleware for GymVerse
 * JWT token verification and user authentication
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'User account is deactivated',
        });
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(401).json({
          success: false,
          error: 'User account is temporarily locked',
        });
      }

      // Add user to request object
      req.user = user;
      next();

    } catch (error) {
      logger.error('JWT verification failed:', error);
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }

  } catch (error) {
    logger.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during authentication',
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, continue without user
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id);

      if (user && user.isActive && !user.isLocked) {
        req.user = user;
      } else {
        req.user = null;
      }

      next();

    } catch (error) {
      // If token is invalid, continue without user
      req.user = null;
      next();
    }

  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

// Check if user owns the resource or is admin
const ownerOrAdmin = (resourceUserField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.body[resourceUserField] || req.params.userId || req.resource?.[resourceUserField];
    
    if (resourceUserId && resourceUserId.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this resource',
    });
  };
};

// Rate limiting for login attempts
const loginRateLimit = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return next();
    }

    const user = await User.findByEmail(email).select('+loginAttempts +lockUntil');
    
    if (user && user.isLocked) {
      return res.status(423).json({
        success: false,
        error: 'Account temporarily locked due to too many failed login attempts. Please try again later.',
        lockUntil: user.lockUntil,
      });
    }

    next();
  } catch (error) {
    logger.error('Login rate limit middleware error:', error);
    next();
  }
};

// Validate API key for external integrations
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required',
    });
  }

  // In a real application, you would validate against a database
  const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
  
  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key',
    });
  }

  next();
};

// Middleware to attach user from session/cookie (if implementing session-based auth)
const attachUser = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId);
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    logger.error('Attach user middleware error:', error);
    next();
  }
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  ownerOrAdmin,
  loginRateLimit,
  validateApiKey,
  attachUser,
};
