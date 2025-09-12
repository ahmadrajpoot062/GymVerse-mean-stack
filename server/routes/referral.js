const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { protect } = require('../middlewares/auth');

// Public routes
router.get('/referral/validate/:code', referralController.validateReferralCode);

// Protected routes
router.use(protect);

router.post('/referral/generate', referralController.generateReferralCode);
router.post('/referral/apply', referralController.applyReferralCode);
router.get('/referral/stats', referralController.getReferralStats);

module.exports = router;
