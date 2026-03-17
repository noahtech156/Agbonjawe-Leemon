const { v4: uuidv4 } = require('uuid');
const postModel = require('../models/postModel');

exports.getPosts = (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const result = postModel.getAllPosts({ category }, parseInt(page), parseInt(limit));
  res.json({ success: true, total: result.total, data: result.posts });
};

exports.getPost = (req, res) => {
  const post = postModel.getPostById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
  res.json({ success: true, data: post });
};

exports.createPost = (req, res) => {
  const { title, category, description, content_body } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : '';
  const post = {
    id: uuidv4(),
    title,
    category,
    description,
    content_body,
    image_url,
    created_at: new Date().toISOString()
  };
  postModel.createPost(post);
  res.status(201).json({ success: true, data: post });
};

exports.updatePost = (req, res) => {
  const { title, category, description, content_body } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;
  const data = { title, category, description, content_body };
  if (image_url) data.image_url = image_url;
  const updated = postModel.updatePost(req.params.id, data);
  if (!updated) return res.status(404).json({ success: false, message: 'Post not found' });
  res.json({ success: true, data: updated });
};

exports.deletePost = (req, res) => {
  const deleted = postModel.deletePost(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Post not found' });
  res.json({ success: true, message: 'Post deleted' });
};
