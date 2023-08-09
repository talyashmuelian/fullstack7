const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const custumerController = require("../controllers/custumerController");
const adminController = require("../controllers/adminController");

router.get("/logIn", custumerController.loginCustomer); //למה זה לא כניסה של אדמין-לבדוק
router.post("/createAppointments", adminController.createAppointments);
router.get("/AdminFutureAppointments", adminController.AdminFutureAppointments);

module.exports = router;
