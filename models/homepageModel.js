const pool = require('../config/database');

// Get all homepage content sections
exports.getAllHomepageContent = async () => {
  const [rows] = await pool.query('SELECT * FROM homepage_content ORDER BY sort_order ASC');
  return rows;
};

// Get homepage content by section
exports.getHomepageContentBySection = async (section) => {
  const [rows] = await pool.query('SELECT * FROM homepage_content WHERE section = ? AND is_active = TRUE ORDER BY sort_order ASC', [section]);
  return rows;
};

// Create homepage content
exports.createHomepageContent = async (content) => {
  const { section, title, content: contentText, image_url, button_text, button_url, is_active, sort_order } = content;
  const [result] = await pool.query(
    'INSERT INTO homepage_content (section, title, content, image_url, button_text, button_url, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [section, title, contentText, image_url, button_text, button_url, is_active !== undefined ? is_active : true, sort_order || 0]
  );
  return { id: result.insertId, ...content };
};

// Update homepage content
exports.updateHomepageContent = async (id, data) => {
  const fields = [];
  const values = [];
  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }
  if (!fields.length) return null;
  values.push(id);
  const [result] = await pool.query(
    `UPDATE homepage_content SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

// Delete homepage content
exports.deleteHomepageContent = async (id) => {
  const [result] = await pool.query('DELETE FROM homepage_content WHERE id = ?', [id]);
  return result.affectedRows > 0;
};