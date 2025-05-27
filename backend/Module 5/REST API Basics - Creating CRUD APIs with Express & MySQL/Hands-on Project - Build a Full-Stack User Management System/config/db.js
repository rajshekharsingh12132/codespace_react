const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(config);

  connection.connect((err) => {
    if (err) {
      console.error(`Error connecting to DB: ${err.code} - ${err.message}. Retrying in 5 seconds...`);
      setTimeout(handleDisconnect, 5000);
    } else {
      console.log('Successfully connected to MySQL database.');
    }
  });

  // Handle connection errors after initial connection
  connection.on('error', (err) => {
    console.error('DB error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Reconnecting lost DB connection...');
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection;
