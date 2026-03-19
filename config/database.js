const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'alikpeafoundation',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Echo database connected
pool.getConnection()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

module.exports = pool;