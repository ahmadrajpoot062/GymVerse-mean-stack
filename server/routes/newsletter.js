const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.post('/newsletter/subscribe', newsletterController.subscribe);
router.post('/newsletter/unsubscribe', newsletterController.unsubscribe);
router.put('/newsletter/preferences', newsletterController.updatePreferences);

// Admin routes
router.use(protect);
router.use(authorize(['admin']));

router.get('/newsletter/stats', newsletterController.getStats);
router.get('/newsletter/subscribers', newsletterController.getSubscribers);
router.post('/newsletter/campaign', newsletterController.sendCampaign);

module.exports = router;
