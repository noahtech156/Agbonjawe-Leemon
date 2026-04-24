const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  try {
    // Read the SQL file
    const sqlFile = fs.readFileSync('./config/migrations.sql', 'utf8');
    
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'alikepea_alikepeafoundation'
    });

    console.log('✅ Database connected');

    // Split SQL into individual statements and execute
    const statements = sqlFile.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      }
    }

    console.log('✅ All tables created successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
