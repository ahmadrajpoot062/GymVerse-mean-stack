const express = require('express');
const router = express.Router();
const path = require('path');
const { protect } = require('../middlewares/auth');
const { upload, handleMulterError } = require('../middlewares/upload');
const logger = require('../utils/logger');

// @desc    Upload single file
// @route   POST /api/uploads/single
// @access  Private
const uploadSingle = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileUrl = `/uploads/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`;
    
    logger.info(`File uploaded: ${req.file.filename} by user ${req.user.id}`);

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        path: req.file.path
      }
    });
  } catch (error) {
    logger.error('Upload single file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Upload multiple files
// @route   POST /api/uploads/multiple
// @access  Private
const uploadMultiple = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const files = req.files.map(file => {
      const fileUrl = `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`;
      return {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl,
        path: file.path
      };
    });

    logger.info(`${files.length} files uploaded by user ${req.user.id}`);

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    logger.error('Upload multiple files error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete uploaded file
// @route   DELETE /api/uploads/:filename
// @access  Private
const deleteFile = (req, res) => {
  try {
    const { filename } = req.params;
    const { folder } = req.query;
    
    let filePath;
    if (folder) {
      filePath = path.join(__dirname, '../uploads', folder, filename);
    } else {
      // Search in all folders
      const folders = ['profiles', 'programs', 'exercises', 'misc'];
      for (const f of folders) {
        const testPath = path.join(__dirname, '../uploads', f, filename);
        if (require('fs').existsSync(testPath)) {
          filePath = testPath;
          break;
        }
      }
    }

    if (!filePath || !require('fs').existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    require('fs').unlinkSync(filePath);
    
    logger.info(`File deleted: ${filename} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    logger.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Routes
router.post('/single', protect, upload.single('file'), uploadSingle);
router.post('/multiple', protect, upload.array('files', 5), uploadMultiple);
router.post('/profile', protect, upload.single('profileImage'), uploadSingle);
router.post('/program', protect, upload.single('programImage'), uploadSingle);
router.post('/exercise', protect, upload.fields([
  { name: 'exerciseImage', maxCount: 1 },
  { name: 'exerciseVideo', maxCount: 1 }
]), uploadMultiple);
router.delete('/:filename', protect, deleteFile);

// Error handling
router.use(handleMulterError);

module.exports = router;
