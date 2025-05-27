const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

function handleDisconnect() {
  pool.on('error', (err) => {
    console.error('MySQL pool error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Attempting to reconnect to MySQL...');
      // No need to manually reconnect with pool; this is just a log.
    } else {
      throw err;
    }
  });
}

handleDisconnect();

function query(sql, params) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) {
        console.error('MySQL query error:', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = { pool, query };
