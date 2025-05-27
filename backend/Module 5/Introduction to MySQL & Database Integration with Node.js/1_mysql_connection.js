require('dotenv').config();
const mysql = require('mysql2/promise'); // Use promise-based API for cleaner async/await

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

async function createConnection() {
  try {
    const connection = await mysql.createConnection(config);
    console.log('Connected to MySQL server');
    return connection;
  } catch (error) {
    console.error('Connection error:', error.message);
    throw error;
  }
}

async function createDatabase(connection, dbName) {
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database "${dbName}" created or already exists`);
  } catch (error) {
    console.error('Error creating database:', error.message);
    throw error;
  }
}

async function createTable(connection, dbName) {
  try {
    await connection.query(`USE \`${dbName}\``);
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS students (
        ID INT PRIMARY KEY,
        Name VARCHAR(100),
        Age INT
      )
    `;
    await connection.query(createTableSQL);
    console.log('Table "students" created or already exists');
  } catch (error) {
    console.error('Error creating table:', error.message);
    throw error;
  }
}

async function main() {
  const dbName = 'school';
  let connection;

  try {
    connection = await createConnection();
    await createDatabase(connection, dbName);
    await createTable(connection, dbName);
  } catch (error) {
    console.error('Error in DB setup:', error.message);
  } finally {
    if (connection) await connection.end();
    console.log('Connection closed');
  }
}

// Run main if this file is executed directly
if (require.main === module) {
  main();
}

// Simple inline tests (can be improved with testing frameworks)
async function runTests() {
  try {
    const connection = await createConnection();
    await createDatabase(connection, 'test_db');
    await createTable(connection, 'test_db');
    console.log('✅ All tests passed');
    await connection.query('DROP DATABASE test_db');
    await connection.end();
  } catch (e) {
    console.error('❌ Tests failed:', e.message);
  }
}

// Uncomment to run tests
runTests();
