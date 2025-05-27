require('dotenv').config();
const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school'
};

async function insertStudent(student) {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const sql = 'INSERT INTO students (ID, Name, Age) VALUES (?, ?, ?)';
    const [result] = await connection.execute(sql, [student.ID, student.Name, student.Age]);
    console.log(`Inserted student with ID ${student.ID}`);
  } catch (error) {
    console.error('Error inserting student:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

// Example usage:
const newStudent = {
  ID: 101,
  Name: 'John Doe',
  Age: 21
};

insertStudent(newStudent);
