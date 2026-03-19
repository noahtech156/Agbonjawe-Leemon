const pool = require('../config/database');

// Create a new scholarship application
exports.createScholarship = async (data) => {
    const { fullName, email, documents, status = 'Pending' } = data;
    const [result] = await pool.query(
        'INSERT INTO scholarships (fullName, email, documents, status) VALUES (?, ?, ?, ?)',
        [fullName, email, documents, status]
    );
    return { id: result.insertId, ...data };
};

// Get all scholarship applications
exports.getAllScholarships = async () => {
    const [rows] = await pool.query('SELECT * FROM scholarships ORDER BY id DESC');
    return rows;
};

// Update scholarship status
exports.updateScholarshipStatus = async (id, status) => {
    const [result] = await pool.query(
        'UPDATE scholarships SET status = ? WHERE id = ?',
        [status, id]
    );
    return result.affectedRows > 0;
};