const mysql = require("mysql2");

// Create a connection to the MySQL server
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "211378658",
  database: "appointments",
});

module.exports = connection;
