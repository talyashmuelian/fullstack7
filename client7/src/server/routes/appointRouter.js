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
router.get(
  "/futureAppointments/:customerID",
  appointmentController.getFutureAppointmentsForCus
);
router.get(
  "/availableAppointments",
  appointmentController.getAvailableAppointments
);

router.get(
  "/occupiedAppointments",
  appointmentController.getOccupiedAppointments
);
router.post("/makeAppointment", appointmentController.makeAppointment);
router.delete(
  "/cancelAppointment/:appointment_id",
  appointmentController.cancelAppointment
);
// router.get(
//   "/allFutureAppointments",
//   appointmentController.getAllFutureAppointments
// );
// router.get(
//   "/historyAppointments/:customerID",
//   appointmentController.getHistoryAppointments
// );
// router.get("/:appointmentID/", appointmentController.getAppointment);

module.exports = router;
