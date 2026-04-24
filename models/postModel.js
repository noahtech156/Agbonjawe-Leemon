const pool = require('../config/database');

// Get all posts with optional category filter and pagination
exports.getAllPosts = async (filter = {}, page = 1, limit = 10) => {
  let query = 'SELECT * FROM posts';
  const params = [];
  if (filter.category) {
    query += ' WHERE category = ?';
    params.push(filter.category);
  }
  if (filter.status) {
    query += filter.category ? ' AND status = ?' : ' WHERE status = ?';
    params.push(filter.status);
  }
  query += ' ORDER BY priority DESC, created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), (page - 1) * limit);
  const [rows] = await pool.query(query, params);
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) as total FROM posts WHERE category = ? AND status = ?',
    [filter.category || '', filter.status || 'published']
  );
  return { total, posts: rows };
};

// Get posts by category for frontend display
exports.getPostsByCategory = async (category, limit = 10) => {
  const [rows] = await pool.query(
    'SELECT * FROM posts WHERE category = ? AND status = "published" ORDER BY priority DESC, created_at DESC LIMIT ?',
    [category, limit]
  );
  return rows;
};

// Get post by ID
exports.getPostById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
  return rows[0] || null;
};

// Create a new post
exports.createPost = async (post) => {
  const { title, content, excerpt, category, page_section, image_url, video_url, author, status, priority, metadata } = post;
  const [result] = await pool.query(
    'INSERT INTO posts (title, content, excerpt, category, page_section, image_url, video_url, author, status, priority, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, content, excerpt, category, page_section, image_url, video_url, author, status || 'draft', priority || 0, JSON.stringify(metadata || {})]
  );
  return { id: result.insertId, ...post };
};

// Update a post
exports.updatePost = async (id, data) => {
  const fields = [];
  const values = [];
  for (const key in data) {
    if (key === 'metadata') {
      fields.push(`${key} = ?`);
      values.push(JSON.stringify(data[key]));
    } else {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (!fields.length) return null;
  values.push(id);
  const [result] = await pool.query(
    `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

// Delete a post
exports.deletePost = async (id) => {
  const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
