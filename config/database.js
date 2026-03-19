const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1', // XAMPP default
    user: 'root', // Default XAMPP user
    password: '', // Default XAMPP password (empty)
    database: 'alikpeafoundation', // Ensure this database exists in XAMPP
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;