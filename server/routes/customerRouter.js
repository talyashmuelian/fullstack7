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
router.post("/signIn", custumerController.signinCustomer);
router.get("/logIn", custumerController.loginCustomer);
router.get("/:id/info", custumerController.getCustomerInfo);
module.exports = router;
