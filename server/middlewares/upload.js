const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadsDir;
    
    // Create subdirectories based on file type
    if (file.fieldname === 'profileImage' || file.fieldname === 'avatar') {
      uploadPath = path.join(uploadsDir, 'profiles');
    } else if (file.fieldname === 'programImage') {
      uploadPath = path.join(uploadsDir, 'programs');
    } else if (file.fieldname === 'exerciseVideo' || file.fieldname === 'exerciseImage') {
      uploadPath = path.join(uploadsDir, 'exercises');
    } else {
      uploadPath = path.join(uploadsDir, 'misc');
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    cb(null, `${baseName}-${uniqueSuffix}${extension}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|avi|mov|wmv|flv|webm/;
  const allowedDocTypes = /pdf|doc|docx/;
  
  const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
                  allowedVideoTypes.test(path.extname(file.originalname).toLowerCase()) ||
                  allowedDocTypes.test(path.extname(file.originalname).toLowerCase());
  
  const mimetype = /image|video|application\/pdf|application\/msword|application\/vnd/.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, and documents are allowed.'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for file upload.'
      });
    }
  }
  
  if (err.message === 'Invalid file type. Only images, videos, and documents are allowed.') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  logger.error('Upload error:', err);
  res.status(500).json({
    success: false,
    message: 'File upload failed'
  });
};

// Delete file utility
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`File deleted: ${filePath}`);
    }
  } catch (error) {
    logger.error(`Error deleting file ${filePath}:`, error);
  }
};

module.exports = {
  upload,
  handleMulterError,
  deleteFile
};
