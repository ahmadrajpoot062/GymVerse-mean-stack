const Message = require('../models/Message');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const emailService = require('../utils/emailService');

// @desc    Send contact message
// @route   POST /api/messages/contact
// @access  Public
const sendContactMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Create message record
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      type: 'contact'
    });

    await newMessage.save();

    // Send notification email to admin
    try {
      await emailService.sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@gymverse.com',
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">New Contact Form Submission</h2>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      logger.error('Failed to send contact notification email:', emailError);
    }

    // Send confirmation email to user
    try {
      await emailService.sendEmail({
        to: email,
        subject: 'Thank you for contacting GymVerse',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Thank You for Contacting Us!</h2>
            <p>Dear ${name},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Message:</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p>Best regards,<br>The GymVerse Team</p>
          </div>
        `
      });
    } catch (emailError) {
      logger.error('Failed to send confirmation email:', emailError);
    }

    logger.info(`Contact message received from ${email}: ${subject}`);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    logger.error('Send contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all messages (Admin only)
// @route   GET /api/messages
// @access  Private (Admin)
const getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Message.countDocuments(query);

    res.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private (Admin)
const getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    logger.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update message status
// @route   PUT /api/messages/:id/status
// @access  Private (Admin)
const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    logger.info(`Message status updated: ${req.params.id} to ${status} by admin ${req.user.id}`);

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    logger.error('Update message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    logger.info(`Message deleted: ${req.params.id} by admin ${req.user.id}`);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    logger.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Reply to message
// @route   POST /api/messages/:id/reply
// @access  Private (Admin)
const replyToMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const { reply } = req.body;

    // Update message with reply
    message.reply = reply;
    message.status = 'replied';
    message.repliedAt = new Date();
    message.repliedBy = req.user.id;

    await message.save();

    // Send reply email
    try {
      await emailService.sendEmail({
        to: message.email,
        subject: `Re: ${message.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Reply from GymVerse</h2>
            <p>Dear ${message.name},</p>
            <p>Thank you for contacting us. Here's our response to your inquiry:</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Original Message:</h3>
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p>${message.message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div style="background: #ffffff; border: 2px solid #dc2626; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #dc2626;">Our Response:</h3>
              <p>${reply.replace(/\n/g, '<br>')}</p>
            </div>
            
            <p>If you have any further questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The GymVerse Team</p>
          </div>
        `
      });
    } catch (emailError) {
      logger.error('Failed to send reply email:', emailError);
    }

    logger.info(`Reply sent for message ${req.params.id} by admin ${req.user.id}`);

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    logger.error('Reply to message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  sendContactMessage,
  getMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
  replyToMessage
};
