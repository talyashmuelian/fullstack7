const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const custumerController = require("../controllers/custumerController");

router.post("/signIn", custumerController.signinCustomer);
router.get("/logIn", custumerController.loginCustomer);
router.get("/:id/info", custumerController.getCustomerInfo);
module.exports = router;
