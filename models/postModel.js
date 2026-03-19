const pool = require('../config/database');

// Get all posts with optional category filter and pagination
exports.getAllPosts = async (filter = {}, page = 1, limit = 10) => {
  let query = 'SELECT * FROM posts';
  const params = [];
  if (filter.category) {
    query += ' WHERE category = ?';
    params.push(filter.category);
  }
  query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), (page - 1) * limit);
  const [rows] = await pool.query(query, params);
  const [[{ total }]] = await pool.query(
    filter.category
      ? 'SELECT COUNT(*) as total FROM posts WHERE category = ?'
      : 'SELECT COUNT(*) as total FROM posts',
    filter.category ? [filter.category] : []
  );
  return { total, posts: rows };
};

// Get post by ID
exports.getPostById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
  return rows[0] || null;
};

// Create a new post
exports.createPost = async (post) => {
  const { title, content, category, author } = post;
  const [result] = await pool.query(
    'INSERT INTO posts (title, content, category, author) VALUES (?, ?, ?, ?)',
    [title, content, category, author]
  );
  return { id: result.insertId, ...post };
};

// Update a post
exports.updatePost = async (id, data) => {
  const fields = [];
  const values = [];
  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
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
