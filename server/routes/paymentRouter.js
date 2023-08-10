const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.get("/allVouchers", paymentController.getAllVouchers);
router.put("/pay/:voucherId", paymentController.pay);
module.exports = router;
