const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.get('/blogs', blogController.getBlogs);
router.get('/blogs/categories', blogController.getCategories);
router.get('/blogs/tags', blogController.getTags);
router.get('/blogs/:slug', blogController.getBlog);

// Protected routes
router.use(protect);

// User routes
router.post('/blogs/:id/like', blogController.toggleLike);
router.post('/blogs/:id/comments', blogController.addComment);

// Admin/Content creator routes
router.post('/blogs', authorize(['admin', 'trainer']), blogController.createBlog);
router.put('/blogs/:id', authorize(['admin', 'trainer']), blogController.updateBlog);
router.delete('/blogs/:id', authorize(['admin', 'trainer']), blogController.deleteBlog);

module.exports = router;
