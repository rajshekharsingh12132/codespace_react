const mysql = require('mysql2');

// Create a connection to MySQL server (adjust credentials as needed)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // replace with your MySQL username
  password: 'password' // replace with your MySQL password
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');

  // Create database 'school'
  connection.query('CREATE DATABASE IF NOT EXISTS school', (err) => {
    if (err) throw err;
    console.log('Database "school" created or already exists');

    // Use the 'school' database
    connection.query('USE school', (err) => {
      if (err) throw err;

      // Create 'students' table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS students (
          ID INT PRIMARY KEY,
          Name VARCHAR(100),
          Age INT
        )
      `;

      connection.query(createTableQuery, (err) => {
        if (err) throw err;
        console.log('Table "students" created or already exists');

        // Close the connection
        connection.end();
      });
    });
  });
});
