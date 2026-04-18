// Get user by id
exports.getUserById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
};
const pool = require('../config/database');

// Get user by email
exports.getUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
};


// Create a new user
exports.createUser = async (user) => {
    const { name, email, password, role = 'user', status = 'active' } = user;
    const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
        [name, email, password, role, status]
    );
    return { id: result.insertId, name, email, role, status };
};

// Update user status
exports.updateUserStatus = async (id, status) => {
    const [result] = await pool.query(
        'UPDATE users SET status = ? WHERE id = ?',
        [status, id]
    );
    return result.affectedRows > 0;
};

// Update user password
exports.updateUserPassword = async (email, newPassword) => {
    const [result] = await pool.query(
        'UPDATE users SET password = ? WHERE email = ?',
        [newPassword, email]
    );
    return result.affectedRows > 0;
};
