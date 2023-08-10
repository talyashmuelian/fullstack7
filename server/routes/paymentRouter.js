const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/setNewPaymentVoucher", paymentController.setNewPayment);
router.get("/allVouchers", paymentController.getAllVouchers);
router.put("/pay/:voucherId", paymentController.pay);
router.delete("/vouchers/:voucherId", paymentController.deleteVoucher);
module.exports = router;
