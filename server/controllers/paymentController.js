const con = require("../config/database");
var Check = require("../models/check");

// exports.setNewPayment = async (req, res) => {
//   try {
//     const { customer_id, amount_to_be_paid } = req.body;
//     console.log(req.body);

//     const { error } = Check.check("newPayment", req.body);
//     if (error) {
//       console.log("line14", error.details[0].message);
//       return res.status(400).send(error.details[0].message);
//     }

//     con.query(
//       "SELECT * FROM identification_customers WHERE customer_id = ?",
//       [customer_id],
//       async (err, rows1) => {
//         if (err) {
//           console.error("Error retrieving customer:", err);
//           return res.status(500).json({ error: "Error retrieving customer" });
//         }

//         if (!rows1 || rows1.length === 0) {
//           return res.status(404).json({ error: "Customer not found" });
//         }

//         con.query(
//           "SELECT MAX(voucher_id) as max_id FROM payment_vouchers",
//           async (err, result) => {
//             if (err) {
//               console.error("Error retrieving max voucher ID:", err);
//               return res
//                 .status(500)
//                 .json({ error: "Error retrieving max voucher ID" });
//             }

//             const nextId = result[0].max_id + 1;
//             const insertQuery =
//               "INSERT INTO payment_vouchers" +
//               "(voucher_id, customer_id, amount_to_be_paid, paid, voucher_created_at, payment_made_at)" +
//               "VALUES (?, ?, ?, ?, NOW(), ?)";
//             const values = [nextId, customer_id, amount_to_be_paid, 0, null];

//             con.query(insertQuery, values, (err) => {
//               if (err) {
//                 console.error("Error inserting payment:", err);
//                 return res
//                   .status(500)
//                   .json({ error: "Error inserting payment" });
//               }

//               res.status(200).json({
//                 message: "Payment created successfully!",
//                 voucher: {
//                   voucher_id: nextId,
//                   customer_id: customer_id,
//                   amount_to_be_paid: amount_to_be_paid,
//                   paid: 0,
//                   voucher_created_at: Date.now(),
//                   payment_made_at: null,
//                 },
//               });
//             });
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.log("Error:", error);
//     res.status(500).json({ error: error });
//   }
// };

// postsRouter.js (Assuming you already have the required imports and database configuration)

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
        // res.send();
      }
      console.log(paymentResult);
      res.send(JSON.stringify(paymentResult));
    });
  } catch (error) {
    console.error("Error get  payment_vouchers", error);
    res.status(500).json({ error: "Error get  payment_vouchers" });
    //res.send();
  }
};

exports.pay = async (req, res) => {
  try {
    const { voucherId } = req.params; // Assuming the voucherId is provided as a parameter
    console.log("Paying voucher:", voucherId);

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
