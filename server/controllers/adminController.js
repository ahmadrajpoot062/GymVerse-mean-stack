const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Program = require('../models/Program');
const ExercisePlan = require('../models/ExercisePlan');
const DietPlan = require('../models/DietPlan');
const Membership = require('../models/Membership');
const Message = require('../models/Message');
const logger = require('../utils/logger');

// @desc    Get dashboard overview stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalTrainers = await Trainer.countDocuments();
    const totalPrograms = await Program.countDocuments();
    const totalExercisePlans = await ExercisePlan.countDocuments();
    const totalDietPlans = await DietPlan.countDocuments();
    const totalMemberships = await Membership.countDocuments();
    const pendingMessages = await Message.countDocuments({ status: 'pending' });

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersThisMonth = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    // Get active memberships
    const activeMemberships = await Membership.countDocuments({ 
      status: 'active',
      endDate: { $gte: new Date() }
    });

    // Get revenue from active memberships
    const revenueData = await Membership.aggregate([
      {
        $match: {
          status: 'active',
          endDate: { $gte: new Date() }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0] : { totalRevenue: 0, avgPrice: 0 };

    // Get user growth data (last 12 months)
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) 
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get top trainers by rating
    const topTrainers = await Trainer.find()
      .sort({ rating: -1 })
      .limit(5)
      .select('name email rating specialization profileImage');

    // Get recent activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt');

    const recentPrograms = await Program.find()
      .populate('trainer', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title trainer createdAt');

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalTrainers,
          totalPrograms,
          totalExercisePlans,
          totalDietPlans,
          totalMemberships,
          activeMemberships,
          pendingMessages,
          newUsersThisMonth,
          totalRevenue: revenue.totalRevenue,
          avgMembershipPrice: revenue.avgPrice
        },
        userGrowth,
        topTrainers,
        recentActivities: {
          recentUsers,
          recentPrograms
        }
      }
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get user management data
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }
    
    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info(`User status updated: ${user.email} set to ${isActive ? 'active' : 'inactive'} by admin ${req.user.id}`);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Also delete associated trainer profile if exists
    await Trainer.findOneAndDelete({ user: req.params.id });

    logger.info(`User deleted: ${user.email} by admin ${req.user.id}`);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter;
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        dateFilter = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        dateFilter = new Date(now.setDate(now.getDate() - 90));
        break;
      case '1y':
        dateFilter = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        dateFilter = new Date(now.setDate(now.getDate() - 30));
    }

    // User registration trends
    const userTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: dateFilter }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Program creation trends
    const programTrends = await Program.aggregate([
      {
        $match: {
          createdAt: { $gte: dateFilter }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Membership trends
    const membershipTrends = await Membership.aggregate([
      {
        $match: {
          createdAt: { $gte: dateFilter }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$price' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Popular program categories
    const popularCategories = await Program.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        userTrends,
        programTrends,
        membershipTrends,
        popularCategories
      }
    });
  } catch (error) {
    logger.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getAnalytics
};
