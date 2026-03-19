const pool = require('../config/database');

// Create a new contact message
exports.createMessage = async (msg) => {
  const { name, email, message } = msg;
  const [result] = await pool.query(
    'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
    [name, email, message]
  );
  return { id: result.insertId, ...msg };
};

// Get all contact messages
exports.getAllMessages = async () => {
  const [rows] = await pool.query('SELECT * FROM contacts ORDER BY id DESC');
  return rows;
};
