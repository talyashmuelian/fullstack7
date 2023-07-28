const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const custumerController = require("../controllers/custumerController");

// Parse incoming request bodies in a middleware before your handlers
//router.use(bodyParser.json());

// Create a pool to manage database connections
//const pool = mysql.createPool(dbConfig);

// Route to handle the POST request for creating a new customer
router.post("/signInCustomers", custumerController.signinCustomer);
router.get("/logInCustomers", custumerController.loginCustomer);

module.exports = router;
