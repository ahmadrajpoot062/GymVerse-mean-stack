const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getAnalytics
} = require('../controllers/adminController');

// All routes are admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

module.exports = router;
