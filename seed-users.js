const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedUsers() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'alikepea_alikepeafoundation'
    });

    console.log('✅ Connected to database');

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Insert admin user
    const query = `
      INSERT INTO users (name, email, password, role, status) 
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE password = VALUES(password)
    `;

    await connection.execute(query, [
      'Admin User',
      'admin@test.com',
      hashedPassword,
      'admin',
      'active'
    ]);

    console.log('✅ Admin user created/updated successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Email: admin@test.com');
    console.log('Password: password123');
    console.log('Role: admin');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedUsers();
