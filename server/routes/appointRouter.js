const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const appointmentController = require("../controllers/appointController");

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
router.get(
  "/history/:customer_id",
  appointmentController.getHistoryAppointmentsForCus
);
router.put(
  "/replaceAppointment/:sender_appointment_id/:recipient_appointment_id",
  appointmentController.putReplaceAppointment
);

module.exports = router;
