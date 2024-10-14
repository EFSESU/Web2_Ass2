const mysql = require('mysql2/promise'); // Import the mysql2 library for working with MySQL

// Create a connection pool for the database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '5771323',
  database: 'crowdfunding_db'
});

// Export the connection pool for use in other modules
module.exports = pool;