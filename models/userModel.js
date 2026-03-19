const pool = require('../config/database');

// Get user by email
exports.getUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
};

// Create a new user
exports.createUser = async (user) => {
    const { name, email, password } = user;
    const [result] = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
    );
    return { id: result.insertId, ...user };
};

// Update user password
exports.updateUserPassword = async (email, newPassword) => {
    const [result] = await pool.query(
        'UPDATE users SET password = ? WHERE email = ?',
        [newPassword, email]
    );
    return result.affectedRows > 0;
};
