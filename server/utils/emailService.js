/**
 * Email utility for GymVerse
 * Handles sending emails for notifications
 */

const nodemailer = require('nodemailer');
const logger = require('./logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.setupTransporter();
  }

  setupTransporter() {
    try {
      // Check if we're in development with placeholder credentials
      const isPlaceholderConfig = process.env.EMAIL_USER === 'development@gymverse.com' 
        || process.env.EMAIL_PASS === 'development-password';

      if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS || isPlaceholderConfig) {
        if (process.env.NODE_ENV === 'development') {
          logger.info('Email service disabled in development mode (using placeholder credentials)');
        } else {
          logger.warn('Email configuration missing. Email service will not be available.');
        }
        return;
      }

      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      this.isConfigured = true;
      logger.info('Email service configured successfully');
    } catch (error) {
      logger.error('Failed to configure email service:', error.message || error);
    }
  }

  async sendEmail(to, subject, html, text = null) {
    if (!this.isConfigured || !this.transporter) {
      if (process.env.NODE_ENV === 'development') {
        logger.info(`[DEV MODE] Would send email to ${to} with subject: "${subject}"`);
        return true; // Return true in development to prevent errors
      }
      logger.warn('Email service not configured. Cannot send email.');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html,
        text: text || this.stripHtml(html),
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}`, { messageId: result.messageId });
      return true;
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      return false;
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  // Template for trainer registration notification
  async sendTrainerRegistrationNotification(trainerData) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      logger.warn('Admin email not configured. Cannot send trainer registration notification.');
      return false;
    }

    const subject = '🏋️ New Trainer Registration - GymVerse';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #DC2626 0%, #000000 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🏋️ GymVerse</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">New Trainer Registration</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #DC2626; margin-top: 0;">New Trainer Application</h2>
          
          <p>A new trainer has registered and is waiting for approval:</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #000000;">Trainer Details</h3>
            <p><strong>Name:</strong> ${trainerData.name}</p>
            <p><strong>Email:</strong> ${trainerData.email}</p>
            <p><strong>Phone:</strong> ${trainerData.phone}</p>
            <p><strong>Specialty:</strong> ${trainerData.specialty.join(', ')}</p>
            <p><strong>Experience:</strong> ${trainerData.experience.years} years</p>
            <p><strong>Bio:</strong> ${trainerData.bio.substring(0, 200)}...</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/admin/trainers/pending" 
               style="background: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Review Application
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px;">
            Please review the trainer's application and approve or reject it through the admin dashboard.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6B7280; font-size: 14px;">
          <p>Train Hard, Live Strong - GymVerse</p>
          <p>This is an automated notification from the GymVerse system.</p>
        </div>
      </div>
    `;

    return await this.sendEmail(adminEmail, subject, html);
  }

  // Template for trainer approval notification
  async sendTrainerApprovalNotification(trainerEmail, trainerName, isApproved) {
    const subject = isApproved 
      ? '🎉 Welcome to GymVerse - Application Approved!'
      : '📝 GymVerse Application Update';

    const html = isApproved 
      ? this.getApprovalEmailTemplate(trainerName)
      : this.getRejectionEmailTemplate(trainerName);

    return await this.sendEmail(trainerEmail, subject, html);
  }

  getApprovalEmailTemplate(trainerName) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #DC2626 0%, #000000 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🏋️ GymVerse</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Trainer Application Approved</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #10B981; margin-top: 0;">🎉 Congratulations, ${trainerName}!</h2>
          
          <p>We're excited to inform you that your trainer application has been <strong>approved</strong>! Welcome to the GymVerse family.</p>
          
          <div style="background: #f0fdf4; border-left: 4px solid #10B981; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #065f46;">What's Next?</h3>
            <ul style="color: #065f46;">
              <li>Complete your trainer profile</li>
              <li>Upload your training videos</li>
              <li>Set your availability and services</li>
              <li>Start connecting with clients</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/trainer/dashboard" 
               style="background: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
          
          <p>If you have any questions, feel free to contact our support team.</p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6B7280; font-size: 14px;">
          <p>Train Hard, Live Strong - GymVerse</p>
        </div>
      </div>
    `;
  }

  getRejectionEmailTemplate(trainerName) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #DC2626 0%, #000000 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🏋️ GymVerse</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Trainer Application Update</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #DC2626; margin-top: 0;">Application Status Update</h2>
          
          <p>Dear ${trainerName},</p>
          
          <p>Thank you for your interest in becoming a trainer with GymVerse. After careful review, we have decided not to move forward with your application at this time.</p>
          
          <div style="background: #fef2f2; border-left: 4px solid #DC2626; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; color: #7f1d1d;">
              This decision doesn't reflect on your qualifications or potential as a trainer. We encourage you to reapply in the future as our needs and requirements may change.
            </p>
          </div>
          
          <p>If you have any questions about this decision or would like feedback, please don't hesitate to contact us.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/contact" 
               style="background: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Contact Support
            </a>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6B7280; font-size: 14px;">
          <p>Train Hard, Live Strong - GymVerse</p>
        </div>
      </div>
    `;
  }

  // Template for contact form auto-reply
  async sendContactFormReply(userEmail, userName, messageSubject) {
    const subject = `Thank you for contacting GymVerse - ${messageSubject}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #DC2626 0%, #000000 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🏋️ GymVerse</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Thank You for Contacting Us</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #DC2626; margin-top: 0;">Hi ${userName},</h2>
          
          <p>Thank you for reaching out to GymVerse! We've received your message regarding "<strong>${messageSubject}</strong>" and our team will get back to you within 24 hours.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #000000;">What happens next?</h3>
            <ul>
              <li>Our support team will review your message</li>
              <li>You'll receive a detailed response within 24 hours</li>
              <li>For urgent matters, please call us directly</li>
            </ul>
          </div>
          
          <p>In the meantime, feel free to explore our website and check out our latest programs and trainers.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/programs" 
               style="background: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">
              Explore Programs
            </a>
            <a href="${process.env.CLIENT_URL}/trainers" 
               style="background: #000000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Meet Our Trainers
            </a>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6B7280; font-size: 14px;">
          <p>Train Hard, Live Strong - GymVerse</p>
          <p>📧 support@gymverse.com | 📞 (555) 123-4567</p>
        </div>
      </div>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  // Template for newsletter subscription
  async sendWelcomeEmail(userEmail, userName) {
    const subject = '🎉 Welcome to GymVerse - Let\'s Get Started!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #DC2626 0%, #000000 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🏋️ GymVerse</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Welcome to the Community</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #DC2626; margin-top: 0;">Welcome, ${userName}! 🎉</h2>
          
          <p>We're thrilled to have you join the GymVerse community! Get ready to transform your fitness journey with our world-class trainers and programs.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #000000;">Get Started Today:</h3>
            <ul>
              <li>🏋️ Explore our training programs</li>
              <li>👨‍🏫 Connect with professional trainers</li>
              <li>📱 Download our mobile app</li>
              <li>📈 Track your progress</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/dashboard" 
               style="background: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px;">
            Follow us on social media for daily motivation and fitness tips!
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6B7280; font-size: 14px;">
          <p>Train Hard, Live Strong - GymVerse</p>
        </div>
      </div>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }
}

const emailService = new EmailService();

module.exports = emailService;
