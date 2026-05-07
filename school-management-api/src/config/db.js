const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
});

/**
 * Initialize database: create table if it doesn't exist
 */
async function initializeDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS schools (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(255)   NOT NULL,
      address    VARCHAR(500)   NOT NULL,
      latitude   FLOAT          NOT NULL,
      longitude  FLOAT          NOT NULL,
      created_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  try {
    const conn = await pool.getConnection();
    await conn.query(createTableSQL);
    conn.release();
    console.log('✅  Database initialized — schools table ready.');
  } catch (err) {
    console.error('❌  Failed to initialize database:', err.message);
    throw err;
  }
}

module.exports = { pool, initializeDatabase };
