const Referral = require('../models/Referral');
const User = require('../models/User');
const logger = require('../utils/logger');

// Generate referral code
exports.generateReferralCode = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user already has an active referral code
    const existingReferral = await Referral.findOne({
      referrer: req.user.id,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (existingReferral) {
      return res.json({
        success: true,
        data: {
          code: existingReferral.code,
          expiresAt: existingReferral.expiresAt
        },
        message: 'Active referral code found'
      });
    }

    // Generate unique code
    let code;
    let isUnique = false;
    
    while (!isUnique) {
      code = `${user.firstName.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const existing = await Referral.findOne({ code });
      if (!existing) {
        isUnique = true;
      }
    }

    const referral = new Referral({
      referrer: req.user.id,
      code,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      reward: {
        type: 'discount',
        value: 20 // 20% discount
      }
    });

    await referral.save();

    logger.info(`Referral code generated: ${code} for user ${req.user.email}`);

    res.json({
      success: true,
      data: {
        code: referral.code,
        expiresAt: referral.expiresAt
      },
      message: 'Referral code generated successfully'
    });
  } catch (error) {
    logger.error('Error generating referral code:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating referral code'
    });
  }
};

// Apply referral code
exports.applyReferralCode = async (req, res) => {
  try {
    const { code } = req.body;
    
    const referral = await Referral.findOne({
      code: code.toUpperCase(),
      status: 'pending',
      expiresAt: { $gt: new Date() }
    }).populate('referrer', 'firstName lastName email');

    if (!referral) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired referral code'
      });
    }

    // Check if user is trying to use their own code
    if (referral.referrer._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot use your own referral code'
      });
    }

    // Check if user already used a referral code
    const existingReferral = await Referral.findOne({
      referred: req.user.id,
      status: 'completed'
    });

    if (existingReferral) {
      return res.status(400).json({
        success: false,
        message: 'You have already used a referral code'
      });
    }

    // Update referral
    referral.referred = req.user.id;
    referral.status = 'completed';
    referral.completedAt = new Date();
    await referral.save();

    // Update both users with rewards
    const referred = await User.findById(req.user.id);
    const referrer = await User.findById(referral.referrer._id);

    // Give discount to referred user
    referred.credits = (referred.credits || 0) + referral.reward.value;
    await referred.save();

    // Give reward to referrer
    referrer.credits = (referrer.credits || 0) + 10; // $10 credit
    await referrer.save();

    logger.info(`Referral code applied: ${code} by ${req.user.email}`);

    res.json({
      success: true,
      data: {
        discount: referral.reward.value,
        referrerName: `${referral.referrer.firstName} ${referral.referrer.lastName}`
      },
      message: 'Referral code applied successfully'
    });
  } catch (error) {
    logger.error('Error applying referral code:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying referral code'
    });
  }
};

// Get user's referral stats
exports.getReferralStats = async (req, res) => {
  try {
    const referrals = await Referral.find({
      referrer: req.user.id
    }).populate('referred', 'firstName lastName email joinedAt');

    const stats = {
      totalReferrals: referrals.length,
      completedReferrals: referrals.filter(r => r.status === 'completed').length,
      pendingReferrals: referrals.filter(r => r.status === 'pending').length,
      totalEarnings: referrals.filter(r => r.status === 'completed').length * 10,
      referrals: referrals
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error fetching referral stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching referral statistics'
    });
  }
};

// Validate referral code (public)
exports.validateReferralCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    const referral = await Referral.findOne({
      code: code.toUpperCase(),
      status: 'pending',
      expiresAt: { $gt: new Date() }
    }).populate('referrer', 'firstName lastName');

    if (!referral) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired referral code'
      });
    }

    res.json({
      success: true,
      data: {
        valid: true,
        referrerName: `${referral.referrer.firstName} ${referral.referrer.lastName}`,
        reward: referral.reward,
        expiresAt: referral.expiresAt
      },
      message: 'Referral code is valid'
    });
  } catch (error) {
    logger.error('Error validating referral code:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating referral code'
    });
  }
};
