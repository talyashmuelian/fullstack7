const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const custumerController = require("../controllers/custumerController");

router.get("/logIn", custumerController.loginCustomer);
module.exports = router;
