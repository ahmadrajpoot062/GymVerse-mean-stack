const Blog = require('../models/Blog');
const User = require('../models/User');
const logger = require('../utils/logger');

// Get all published blogs with pagination
exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const tags = req.query.tags ? req.query.tags.split(',') : null;
    const search = req.query.search;

    const filter = { published: true };

    if (category) {
      filter.category = category;
    }

    if (tags) {
      filter.tags = { $in: tags };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'firstName lastName profilePicture')
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(filter);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs'
    });
  }
};

// Get single blog by slug
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug, 
      published: true 
    })
      .populate('author', 'firstName lastName profilePicture bio')
      .populate('comments.user', 'firstName lastName profilePicture')
      .populate('comments.replies.user', 'firstName lastName profilePicture');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    logger.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post'
    });
  }
};

// Create new blog (admin/content creator only)
exports.createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user.id,
      slug: req.body.title.toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    };

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: blogData.slug });
    if (existingBlog) {
      blogData.slug += '-' + Date.now();
    }

    const blog = new Blog(blogData);
    await blog.save();

    await blog.populate('author', 'firstName lastName profilePicture');

    logger.info(`Blog created: ${blog.title} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog post created successfully'
    });
  } catch (error) {
    logger.error('Error creating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog post'
    });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check if user is author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog post'
      });
    }

    // Update slug if title changed
    if (req.body.title && req.body.title !== blog.title) {
      req.body.slug = req.body.title.toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const existingBlog = await Blog.findOne({ 
        slug: req.body.slug, 
        _id: { $ne: blog._id } 
      });
      if (existingBlog) {
        req.body.slug += '-' + Date.now();
      }
    }

    Object.assign(blog, req.body);
    await blog.save();

    await blog.populate('author', 'firstName lastName profilePicture');

    logger.info(`Blog updated: ${blog.title} by ${req.user.email}`);

    res.json({
      success: true,
      data: blog,
      message: 'Blog post updated successfully'
    });
  } catch (error) {
    logger.error('Error updating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog post'
    });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check if user is author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog post'
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    logger.info(`Blog deleted: ${blog.title} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog post'
    });
  }
};

// Like/unlike blog
exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const likeIndex = blog.likes.indexOf(req.user.id);
    let action;

    if (likeIndex > -1) {
      blog.likes.splice(likeIndex, 1);
      action = 'unliked';
    } else {
      blog.likes.push(req.user.id);
      action = 'liked';
    }

    await blog.save();

    res.json({
      success: true,
      data: {
        likes: blog.likes.length,
        userLiked: action === 'liked'
      },
      message: `Blog post ${action} successfully`
    });
  } catch (error) {
    logger.error('Error toggling blog like:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog like'
    });
  }
};

// Add comment to blog
exports.addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const comment = {
      user: req.user.id,
      content: req.body.content
    };

    blog.comments.push(comment);
    await blog.save();

    await blog.populate('comments.user', 'firstName lastName profilePicture');

    const newComment = blog.comments[blog.comments.length - 1];

    res.status(201).json({
      success: true,
      data: newComment,
      message: 'Comment added successfully'
    });
  } catch (error) {
    logger.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment'
    });
  }
};

// Get blog categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { published: true });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
};

// Get popular tags
exports.getTags = async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { published: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      data: tags.map(tag => ({ name: tag._id, count: tag.count }))
    });
  } catch (error) {
    logger.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tags'
    });
  }
};
