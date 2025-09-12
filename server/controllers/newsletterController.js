const Newsletter = require('../models/Newsletter');
const emailService = require('../utils/emailService');
const logger = require('../utils/logger');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const { email, firstName, lastName, preferences } = req.body;

    // Check if already subscribed
    let subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (subscriber) {
      if (subscriber.status === 'subscribed') {
        return res.status(400).json({
          success: false,
          message: 'Email is already subscribed to newsletter'
        });
      } else {
        // Resubscribe
        subscriber.status = 'subscribed';
        subscriber.subscribedAt = new Date();
        subscriber.unsubscribedAt = undefined;
        if (firstName) subscriber.firstName = firstName;
        if (lastName) subscriber.lastName = lastName;
        if (preferences) subscriber.preferences = preferences;
        await subscriber.save();
      }
    } else {
      // New subscription
      subscriber = new Newsletter({
        email: email.toLowerCase(),
        firstName,
        lastName,
        preferences: preferences || {
          frequency: 'weekly',
          categories: ['fitness', 'nutrition', 'wellness']
        }
      });
      await subscriber.save();
    }

    // Send welcome email
    try {
      await emailService.sendEmail({
        to: email,
        subject: 'Welcome to GymVerse Newsletter!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Welcome to GymVerse!</h2>
            <p>Hi ${firstName || 'there'},</p>
            <p>Thank you for subscribing to our newsletter! You'll receive the latest fitness tips, nutrition advice, and exclusive offers.</p>
            <p>You've chosen to receive emails ${subscriber.preferences.frequency}.</p>
            <div style="margin: 20px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
              <h3>What to expect:</h3>
              <ul>
                <li>Expert fitness and nutrition tips</li>
                <li>Exclusive workout programs</li>
                <li>Special offers and promotions</li>
                <li>Community updates and success stories</li>
              </ul>
            </div>
            <p>You can update your preferences or unsubscribe at any time.</p>
            <p>Stay strong!</p>
            <p><strong>The GymVerse Team</strong></p>
          </div>
        `
      });
    } catch (emailError) {
      logger.error('Error sending welcome email:', emailError);
    }

    logger.info(`Newsletter subscription: ${email}`);

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    logger.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Error subscribing to newsletter'
    });
  }
};

// Unsubscribe from newsletter
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in newsletter'
      });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    logger.info(`Newsletter unsubscription: ${email}`);

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    logger.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Error unsubscribing from newsletter'
    });
  }
};

// Update newsletter preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { email, preferences } = req.body;

    const subscriber = await Newsletter.findOne({ 
      email: email.toLowerCase(),
      status: 'subscribed'
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    subscriber.preferences = { ...subscriber.preferences, ...preferences };
    await subscriber.save();

    logger.info(`Newsletter preferences updated: ${email}`);

    res.json({
      success: true,
      data: subscriber.preferences,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    logger.error('Error updating newsletter preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences'
    });
  }
};

// Get newsletter statistics (admin only)
exports.getStats = async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments({ status: 'subscribed' });
    const totalUnsubscribed = await Newsletter.countDocuments({ status: 'unsubscribed' });
    const recentSubscribers = await Newsletter.countDocuments({
      status: 'subscribed',
      subscribedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Get subscribers by category preferences
    const categoryStats = await Newsletter.aggregate([
      { $match: { status: 'subscribed' } },
      { $unwind: '$preferences.categories' },
      { $group: { _id: '$preferences.categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get subscribers by frequency preferences
    const frequencyStats = await Newsletter.aggregate([
      { $match: { status: 'subscribed' } },
      { $group: { _id: '$preferences.frequency', count: { $sum: 1 } } }
    ]);

    const stats = {
      totalSubscribers,
      totalUnsubscribed,
      recentSubscribers,
      categoryPreferences: categoryStats,
      frequencyPreferences: frequencyStats,
      growthRate: recentSubscribers / Math.max(totalSubscribers - recentSubscribers, 1) * 100
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error fetching newsletter stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching newsletter statistics'
    });
  }
};

// Send newsletter campaign (admin only)
exports.sendCampaign = async (req, res) => {
  try {
    const { subject, content, category, frequency } = req.body;

    const filter = { status: 'subscribed' };

    if (category) {
      filter['preferences.categories'] = category;
    }

    if (frequency) {
      filter['preferences.frequency'] = frequency;
    }

    const subscribers = await Newsletter.find(filter);

    if (subscribers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No subscribers found matching criteria'
      });
    }

    let sentCount = 0;
    let failedCount = 0;

    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 50;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (subscriber) => {
        try {
          await emailService.sendEmail({
            to: subscriber.email,
            subject,
            html: content.replace(/{{firstName}}/g, subscriber.firstName || 'there')
          });

          // Update subscriber stats
          subscriber.emailsSent += 1;
          subscriber.lastEmailSent = new Date();
          await subscriber.save();

          sentCount++;
        } catch (emailError) {
          logger.error(`Error sending email to ${subscriber.email}:`, emailError);
          failedCount++;
        }
      }));

      // Add delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    logger.info(`Newsletter campaign sent: ${sentCount} successful, ${failedCount} failed`);

    res.json({
      success: true,
      data: {
        totalSubscribers: subscribers.length,
        sentCount,
        failedCount
      },
      message: 'Newsletter campaign sent successfully'
    });
  } catch (error) {
    logger.error('Error sending newsletter campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending newsletter campaign'
    });
  }
};

// Get subscriber list (admin only)
exports.getSubscribers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || 'subscribed';

    const subscribers = await Newsletter.find({ status })
      .select('-__v')
      .sort({ subscribedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Newsletter.countDocuments({ status });

    res.json({
      success: true,
      data: {
        subscribers,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscribers'
    });
  }
};
