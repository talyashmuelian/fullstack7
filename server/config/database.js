const mysql = require("mysql2");

// Create a connection to the MySQL server
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "e315439554",
  database: "appointments",
});

module.exports = connection;
