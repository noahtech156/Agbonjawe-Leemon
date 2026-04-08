// Update commentary fields for a disbursement
exports.updateCommentary = async (id, { received, notReceived, time, appreciation }) => {
    const [result] = await pool.query(
        'UPDATE disbursements SET received = ?, notReceived = ?, time = ?, appreciation = ? WHERE id = ?',
        [received ? 1 : 0, notReceived ? 1 : 0, time, appreciation, id]
    );
    return result.affectedRows > 0;
};
const pool = require('../config/database');

// Create a new disbursement (store all fields as JSON in details)
exports.createDisbursement = async (userId, amount, details) => {
    // details should be an object with all fields
    const detailsJson = JSON.stringify(details);
    const [result] = await pool.query(
        'INSERT INTO disbursements (user_id, amount, details) VALUES (?, ?, ?)',
        [userId, amount, detailsJson]
    );
    return { id: result.insertId, user_id: userId, amount, details };
};

// Get all disbursements for a user
exports.getUserDisbursements = async (userId) => {
    const [rows] = await pool.query(
        'SELECT * FROM disbursements WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
    );
    return rows;
};

// Get all disbursements (admin)
exports.getAllDisbursements = async () => {
    const [rows] = await pool.query('SELECT * FROM disbursements ORDER BY created_at DESC');
    // Parse details JSON for each row
    return rows.map(row => {
        let details = {};
        try { details = JSON.parse(row.details); } catch {}
        return { ...row, details };
    });
};
