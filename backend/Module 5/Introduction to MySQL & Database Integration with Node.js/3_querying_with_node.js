require('dotenv').config();
const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school',
};

async function getStudentsAboveAge(minAge) {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const query = 'SELECT * FROM students WHERE Age > ?';
    const [rows] = await connection.execute(query, [minAge]);
    return rows;
  } catch (error) {
    console.error('Error querying students:', error.message);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

// Self-test example
async function main() {
  try {
    const students = await getStudentsAboveAge(14);
    console.log('Students older than 14:', students);
  } catch (e) {
    console.error('Failed to fetch students:', e.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getStudentsAboveAge };
