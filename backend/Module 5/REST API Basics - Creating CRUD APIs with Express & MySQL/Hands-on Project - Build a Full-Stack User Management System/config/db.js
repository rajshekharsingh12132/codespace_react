const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection to the MySQL database using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,     // Database host, e.g., localhost
  user: process.env.DB_USER,     // Database username
  password: process.env.DB_PASS, // Database password
  database: process.env.DB_NAME, // Database name to use
  port: 3306,                    // Default MySQL port (optional)
});

// Connect to the database and handle errors properly
db.connect((err) => {
  if (err) {
    console.error(`Database connection failed: ${err.code} - ${err.message}`);
    process.exit(1); // Exit process if DB connection fails to avoid app instability
  }
  console.log('Successfully connected to the MySQL database.');
});

module.exports = db;
