const pool = require('../config/database');

// Get all active news ticker items
exports.getActiveNewsTicker = async () => {
  const [rows] = await pool.query('SELECT * FROM news_ticker WHERE is_active = TRUE ORDER BY sort_order ASC, created_at DESC');
  return rows;
};

// Get all news ticker items
exports.getAllNewsTicker = async () => {
  const [rows] = await pool.query('SELECT * FROM news_ticker ORDER BY sort_order ASC, created_at DESC');
  return rows;
};

// Create news ticker item
exports.createNewsTicker = async (ticker) => {
  const { content, is_active, sort_order } = ticker;
  const [result] = await pool.query(
    'INSERT INTO news_ticker (content, is_active, sort_order) VALUES (?, ?, ?)',
    [content, is_active !== undefined ? is_active : true, sort_order || 0]
  );
  return { id: result.insertId, ...ticker };
};

// Update news ticker item
exports.updateNewsTicker = async (id, data) => {
  const fields = [];
  const values = [];
  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }
  if (!fields.length) return null;
  values.push(id);
  const [result] = await pool.query(
    `UPDATE news_ticker SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

// Delete news ticker item
exports.deleteNewsTicker = async (id) => {
  const [result] = await pool.query('DELETE FROM news_ticker WHERE id = ?', [id]);
  return result.affectedRows > 0;
};