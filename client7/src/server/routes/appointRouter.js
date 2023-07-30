const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const appointmentController = require("../controllers/appointController");

// Parse incoming request bodies in a middleware before your handlers
//router.use(bodyParser.json());

// Create a pool to manage database connections
//const pool = mysql.createPool(dbConfig);

// Route to handle the POST request for creating a new customer
//router.post("/signIn", custumerController.signinCustomer);
router.get("/:appointmentID/", appointmentController.getAppointment);
router.get(
  "/availableAppointments",
  appointmentController.getAvailableAppointments
);
router.get(
  "/futureAppointments/:customerID",
  appointmentController.getFutureAppointments
);
router.get(
  "/allFutureAppointments",
  appointmentController.getAllFutureAppointments
);
router.get(
  "/historyAppointments/:customerID",
  appointmentController.getHistoryAppointments
);

module.exports = router;
