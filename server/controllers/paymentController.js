const con = require("../config/database");
var Check = require("../models/check");

exports.getAllVouchers = async (req, res) => {
  try {
    console.log("getAllVouchers");
    const { userId } = req.query;
    console.log(userId);

    // Check if the username and password exist together in the database
    const paymentQuery = "SELECT * FROM payment_vouchers WHERE customer_id = ?";
    con.query(paymentQuery, [userId], async (paymentErr, paymentResult) => {
      if (paymentErr) {
        console.error("Error get  payment_vouchers:", paymentErr);

        res.status(500).json({ error: "Error get  payment_vouchers" });
      }
      console.log(paymentResult);
      res.send(JSON.stringify(paymentResult));
    });
  } catch (error) {
    console.error("Error get  payment_vouchers", error);
    res.status(500).json({ error: "Error get  payment_vouchers" });
  }
};

exports.pay = async (req, res) => {
  try {
    const { voucherId } = req.params;

    // Update the voucher's payment status to "paid" in the database
    const updateQuery =
      "UPDATE payment_vouchers SET paid = 1, payment_made_at = NOW() WHERE voucher_id = ?";
    con.query(updateQuery, [voucherId], async (updateErr, updateResult) => {
      if (updateErr) {
        console.error("Error updating voucher status:", updateErr);
        res.status(500).json({ error: "Error updating voucher status" });
      } else {
        console.log("Voucher status updated successfully");
        res.json({ message: "Voucher payment successful" });
      }
    });
  } catch (error) {
    console.error("Error paying voucher:", error);
    res.status(500).json({ error: "Error paying voucher" });
  }
};
