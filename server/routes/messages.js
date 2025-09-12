const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middlewares/auth');
const {
  sendContactMessage,
  getMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
  replyToMessage
} = require('../controllers/messageController');

// Validation rules
const contactMessageValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().trim().withMessage('Subject is required'),
  body('message').notEmpty().trim().withMessage('Message is required')
];

const replyValidation = [
  body('reply').notEmpty().trim().withMessage('Reply message is required')
];

// Public routes
router.post('/contact', contactMessageValidation, sendContactMessage);

// Admin routes
router.get('/', protect, authorize('admin'), getMessages);
router.get('/:id', protect, authorize('admin'), getMessage);
router.put('/:id/status', protect, authorize('admin'), updateMessageStatus);
router.post('/:id/reply', protect, authorize('admin'), replyValidation, replyToMessage);
router.delete('/:id', protect, authorize('admin'), deleteMessage);

module.exports = router;
