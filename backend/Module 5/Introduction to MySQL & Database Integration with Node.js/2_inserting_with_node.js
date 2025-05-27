require('dotenv').config();
const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school',
};

// Basic input validation
function validateStudent(student) {
  if (
    !student ||
    typeof student.ID !== 'number' ||
    typeof student.Name !== 'string' ||
    typeof student.Age !== 'number' ||
    student.Name.trim() === ''
  ) {
    throw new Error('Invalid student data. Expecting {ID: number, Name: non-empty string, Age: number}');
  }
}

async function insertStudent(student) {
  let connection;
  try {
    validateStudent(student);

    connection = await mysql.createConnection(config);
    const sql = 'INSERT INTO students (ID, Name, Age) VALUES (?, ?, ?)';
    await connection.execute(sql, [student.ID, student.Name.trim(), student.Age]);

    console.log(`Inserted student with ID ${student.ID}`);
    return true;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('Duplicate entry: A student with this ID already exists.');
    } else {
      console.error('Error inserting student:', error.message);
    }
    return false;
  } finally {
    if (connection) await connection.end();
  }
}

// Inline test example
async function runTest() {
  const testStudent = { ID: 1, Name: 'Test Student', Age: 20 };
  const success = await insertStudent(testStudent);
  if (success) {
    console.log('✅ Test insert passed');
  } else {
    console.log('❌ Test insert failed');
  }
}

// If run directly, execute test
if (require.main === module) {
  runTest();
}

module.exports = { insertStudent };
