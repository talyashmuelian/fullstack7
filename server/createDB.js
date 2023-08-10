const mysql = require("mysql2");

// Create a connection to the MySQL server
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "211378658",
});

// Replace 'your_mysql_host', 'your_mysql_user', and 'your_mysql_password'
// with your actual MySQL server connection details

// Database name
const databaseName = "appointments";

// SQL statements to create the tables
const sqlStatements = [
  // 1. Identification customers
  `CREATE TABLE identification_customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL
  )`,
  // 2. Customer information
  `CREATE TABLE customer_information (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    id_number VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100)
  )`,
  // 3. Appointments
  `CREATE TABLE appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    date_time DATETIME NOT NULL
  )`,
  // 4. Customer appointment
  `CREATE TABLE customer_appointment (
    customer_appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    appointment_id INT,
    reminder BOOLEAN,
    FOREIGN KEY (customer_id) REFERENCES identification_customers(customer_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
  )`,
  // 5. Requests
  `CREATE TABLE requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_client_id INT,
    recipient_client_id INT,
    recipient_appointment_id INT,
    FOREIGN KEY (sender_client_id) REFERENCES identification_customers(customer_id),
    FOREIGN KEY (recipient_client_id) REFERENCES identification_customers(customer_id),
    FOREIGN KEY (recipient_appointment_id) REFERENCES appointments(appointment_id)
  )`,
  // 6. Payment vouchers
  `CREATE TABLE payment_vouchers (
    voucher_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    amount_to_be_paid DECIMAL(10, 2),
    paid BOOLEAN,
    voucher_created_at DATETIME,
    payment_made_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES identification_customers(customer_id)
  )`,
  // 7. Messages
  `CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_client_id INT,
    recipient_client_id INT,
    text TEXT,
    date_time DATETIME,
    FOREIGN KEY (sender_client_id) REFERENCES identification_customers(customer_id),
    FOREIGN KEY (recipient_client_id) REFERENCES identification_customers(customer_id)
  )`,
  // 8. Admin table
  `CREATE TABLE admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES identification_customers(customer_id)
  )`,
];

// SQL statements to insert data into the tables
const dataInsertions = [
  // Insert data for identification_customers
  `INSERT INTO identification_customers (username, password)
  VALUES
    ('user1', 'password1'),
    ('user2', 'password2'),
    ('user3', 'password3')`,

  // Insert data for customer_information
  `INSERT INTO customer_information (customer_id, name, id_number, phone, email)
  VALUES
    (1, 'John Doe', '1234567890', '+1234567890', 'john.doe@example.com'),
    (2, 'Jane Smith', '9876543210', '+9876543210', 'jane.smith@example.com'),
    (3, 'Michael Johnson', '4567890123', '+4567890123', 'michael.johnson@example.com')`,

  // Insert data for appointments
  `INSERT INTO appointments (date_time)
  VALUES
    ('2023-08-10 09:00:00'),
    ('2023-08-15 14:30:00'),
    ('2023-08-20 11:45:00')`,

  // Insert data for customer_appointment
  `INSERT INTO customer_appointment (customer_id, appointment_id, reminder)
  VALUES
    (1, 1, 1),
    (2, 2, 0),
    (3, 3, 1)`,

  // Insert data for requests
  `INSERT INTO requests (sender_client_id, recipient_client_id, recipient_appointment_id)
  VALUES
    (1, 2, 1),
    (2, 3, 2),
    (3, 1, 3)`,

  // Insert data for payment_vouchers
  `INSERT INTO payment_vouchers (customer_id, amount_to_be_paid, paid, voucher_created_at, payment_made_at)
  VALUES
    (1, 100.00, 1, '2023-07-25 10:00:00', '2023-07-25 11:30:00'),
    (2, 50.00, 0, '2023-07-25 11:30:00', NULL),
    (3, 75.00, 1, '2023-07-25 12:00:00', '2023-07-25 12:15:00')`,

  // Insert data for messages
  `INSERT INTO messages (sender_client_id, recipient_client_id, text, date_time)
  VALUES
    (1, 2, 'Hello Jane, how are you?', '2023-07-25 13:00:00'),
    (2, 1, 'Hi John, I am doing well. Thanks!', '2023-07-25 13:05:00'),
    (3, 1, 'Hey John, do you have a moment?', '2023-07-25 13:10:00')`,

  // Insert data for admin
  `INSERT INTO admin (customer_id)
  VALUES
    (1),
    (2)`,
];

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }

  // Create the database
  connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`, (err) => {
    if (err) {
      console.error("Error creating the database:", err);
      connection.end();
      return;
    }

    console.log("Database created.");

    // Use the created database
    connection.query(`USE ${databaseName}`, (err) => {
      if (err) {
        console.error("Error selecting the database:", err);
        connection.end();
        return;
      }

      console.log("Database selected.");

      // Create the tables
      createTables(connection, sqlStatements, () => {
        // Insert data into the tables
        insertData(connection, dataInsertions, () => {
          console.log("Data inserted.");

          // Close the connection
          connection.end();
        });
      });
    });
  });
});

function createTables(connection, statements, callback) {
  let index = 0;
  createNextTable();

  function createNextTable() {
    if (index >= statements.length) {
      callback();
      return;
    }

    connection.query(statements[index], (err) => {
      if (err) {
        console.error("Error creating table:", err);
        connection.end();
        return;
      }

      console.log("Table created:", index + 1);
      index++;
      createNextTable();
    });
  }
}

function insertData(connection, insertions, callback) {
  let index = 0;
  insertNextData();

  function insertNextData() {
    if (index >= insertions.length) {
      callback();
      return;
    }

    connection.query(insertions[index], (err) => {
      if (err) {
        console.error("Error inserting data:", err);
        connection.end();
        return;
      }

      console.log("Data inserted:", index + 1);
      index++;
      insertNextData();
    });
  }
}

///updates
// ALTER TABLE requests
// ADD COLUMN sender_appointment_id INT,
// ADD CONSTRAINT fk_sender_appointment
// FOREIGN KEY (sender_appointment_id) REFERENCES appointments(appointment_id);

// ALTER TABLE appointments.admin
// ADD token VARCHAR(255);
