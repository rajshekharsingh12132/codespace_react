const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit: 10, // max simultaneous connections
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Simple query wrapper returning Promise for async/await usage
function query(sql, params) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) {
        console.error('MySQL Query Error:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
}

pool.on('connection', (connection) => {
  console.log('MySQL pool connected: threadId ' + connection.threadId);
});

pool.on('error', (err) => {
  console.error('MySQL pool error:', err);
  // Optional: add reconnection logic here if necessary
});

module.exports = { pool, query };
