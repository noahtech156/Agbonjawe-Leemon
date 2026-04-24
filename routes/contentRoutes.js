const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const postModel = require('../models/postModel');
const homepageModel = require('../models/homepageModel');
const newsTickerModel = require('../models/newsTickerModel');
const requireAuth = require('../middleware/requireAuth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`)
});
const upload = multer({ storage });

// Apply authentication to all routes
router.use(requireAuth);

// POSTS MANAGEMENT
// Get all posts with filtering
router.get('/posts', async (req, res) => {
  try {
    const { category, status, page, limit } = req.query;
    const result = await postModel.getAllPosts(
      { category, status },
      parseInt(page) || 1,
      parseInt(limit) || 20
    );
    res.json(result);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get posts by category for frontend
router.get('/posts/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const posts = await postModel.getPostsByCategory(category, limit);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await postModel.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create new post
router.post('/posts', upload.single('image'), async (req, res) => {
  try {
    const postData = { ...req.body };
    if (req.file) {
      postData.image_url = `/uploads/${req.file.filename}`;
    }
    const post = await postModel.createPost(postData);
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
router.put('/posts/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image_url = `/uploads/${req.file.filename}`;
    } else if (Object.prototype.hasOwnProperty.call(updateData, 'image_url') && updateData.image_url === '') {
      delete updateData.image_url;
    }

    const success = await postModel.updatePost(req.params.id, updateData);
    if (!success) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
router.delete('/posts/:id', async (req, res) => {
  try {
    const success = await postModel.deletePost(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// HOMEPAGE CONTENT MANAGEMENT
// Get all homepage content
router.get('/homepage', async (req, res) => {
  try {
    const content = await homepageModel.getAllHomepageContent();
    res.json(content);
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    res.status(500).json({ error: 'Failed to fetch homepage content' });
  }
});

// Get homepage content by section
router.get('/homepage/section/:section', async (req, res) => {
  try {
    const content = await homepageModel.getHomepageContentBySection(req.params.section);
    res.json(content);
  } catch (error) {
    console.error('Error fetching homepage section:', error);
    res.status(500).json({ error: 'Failed to fetch homepage section' });
  }
});

// Create homepage content
router.post('/homepage', async (req, res) => {
  try {
    const content = await homepageModel.createHomepageContent(req.body);
    res.status(201).json(content);
  } catch (error) {
    console.error('Error creating homepage content:', error);
    res.status(500).json({ error: 'Failed to create homepage content' });
  }
});

// Update homepage content
router.put('/homepage/:id', async (req, res) => {
  try {
    const success = await homepageModel.updateHomepageContent(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ error: 'Homepage content not found' });
    }
    res.json({ message: 'Homepage content updated successfully' });
  } catch (error) {
    console.error('Error updating homepage content:', error);
    res.status(500).json({ error: 'Failed to update homepage content' });
  }
});

// Delete homepage content
router.delete('/homepage/:id', async (req, res) => {
  try {
    const success = await homepageModel.deleteHomepageContent(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Homepage content not found' });
    }
    res.json({ message: 'Homepage content deleted successfully' });
  } catch (error) {
    console.error('Error deleting homepage content:', error);
    res.status(500).json({ error: 'Failed to delete homepage content' });
  }
});

// NEWS TICKER MANAGEMENT
// Get all news ticker items
router.get('/news-ticker', async (req, res) => {
  try {
    const ticker = await newsTickerModel.getAllNewsTicker();
    res.json(ticker);
  } catch (error) {
    console.error('Error fetching news ticker:', error);
    res.status(500).json({ error: 'Failed to fetch news ticker' });
  }
});

// Get active news ticker items
router.get('/news-ticker/active', async (req, res) => {
  try {
    const ticker = await newsTickerModel.getActiveNewsTicker();
    res.json(ticker);
  } catch (error) {
    console.error('Error fetching active news ticker:', error);
    res.status(500).json({ error: 'Failed to fetch active news ticker' });
  }
});

// Create news ticker item
router.post('/news-ticker', async (req, res) => {
  try {
    const ticker = await newsTickerModel.createNewsTicker(req.body);
    res.status(201).json(ticker);
  } catch (error) {
    console.error('Error creating news ticker:', error);
    res.status(500).json({ error: 'Failed to create news ticker' });
  }
});

// Update news ticker item
router.put('/news-ticker/:id', async (req, res) => {
  try {
    const success = await newsTickerModel.updateNewsTicker(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ error: 'News ticker item not found' });
    }
    res.json({ message: 'News ticker updated successfully' });
  } catch (error) {
    console.error('Error updating news ticker:', error);
    res.status(500).json({ error: 'Failed to update news ticker' });
  }
});

// Delete news ticker item
router.delete('/news-ticker/:id', async (req, res) => {
  try {
    const success = await newsTickerModel.deleteNewsTicker(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'News ticker item not found' });
    }
    res.json({ message: 'News ticker deleted successfully' });
  } catch (error) {
    console.error('Error deleting news ticker:', error);
    res.status(500).json({ error: 'Failed to delete news ticker' });
  }
});

module.exports = router;