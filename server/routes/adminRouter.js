const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const adminController = require("../controllers/adminController");

router.get("/logIn", adminController.loginAdmin);
router.post("/createAppointments", adminController.createAppointments);
router.get("/AdminFutureAppointments", adminController.AdminFutureAppointments);
router.get("/users", adminController.getAllUsers);
router.get("/vouchers", adminController.getAllVouchers);
router.delete("/vouchers/:voucherId", adminController.deleteVoucher);
router.post("/setNewPaymentVoucher", adminController.setNewPayment);
router.delete(
  "/cancelAppointment/:appointment_id",
  adminController.cancelAppointment
);
module.exports = router;
