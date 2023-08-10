const con = require("../config/database");
var Check = require("../models/check");

// exports.setNewPayment = async (req, res) => {
//   const { customer_id, amount_to_be_paid } = req.body;
//   const { error } = Check.check("newPayment", req.body);
//   if (error) {
//     console.log("line14", error.details[0].message);
//     res.status(400).send(error.details[0].message);
//     return;
//   }
//   // Get the maximum customer_id from the database and increment it by 1
//   try {
//     const query =
//       "SELECT * FROM identification_customers WHERE customer_id = ?";
//     const [rows1] = await con.query(query, [customer_id]);

//     // If no customer with the given ID is found, return an error
//     if (rows1.length === 0) {
//       res.status(404).json({ error: "Customer not found" });
//       con.end();
//       return;
//     }
//     let [result] = await con.query(
//       "SELECT MAX(voucher_id) as max_id FROM payment_vouchers"
//     );
//     const nextId = result[0].max_id + 1;
//     const insertQuery =
//       "INSERT INTO payment_vouchers" +
//       "(voucher_id, customer_id, amount_to_be_paid, paid, voucher_created_at,payment_made_at)" +
//       "VALUES (?, ?, ?, ?, ?, ?)";
//     const values = [
//       nextId,
//       customer_id,
//       amount_to_be_paid,
//       0,
//       Date.now(),
//       null,
//     ];
//     [result] = await con.query(insertQuery, values);
//     res.status(200).json({
//       message: "Customer created successfully!",
//       voucher: {
//         voucher_id: nextId,
//         customer_id: customer_id,
//         amount_to_be_paid: amount_to_be_paid,
//         paid: 0,
//         voucher_created_at: Date.now(),
//         payment_made_at: null,
//       },
//     });
//     con.end();
//   } catch (error) {
//     console.log("Error :", error);
//     res.status(500).json({ error: error });
//   }
// };

// exports.setNewPayment = async (req, res) => {
//   const { customer_id, amount_to_be_paid } = req.body;
//   console.log(req.body);
//   const { error } = Check.check("newPayment", req.body);
//   if (error) {
//     console.log("line14", error.details[0].message);
//     res.status(400).send(error.details[0].message);
//     return;
//   }
//   try {
//     const rows1 = await con.execute(
//       "SELECT * FROM identification_customers WHERE customer_id = ?",
//       [customer_id]
//     );

//     if (!rows1 || rows1.length === 0) {
//       res.status(404).json({ error: "Customer not found" });
//       await con.end();
//       return;
//     }

//     let [result] = await con.execute(
//       "SELECT MAX(voucher_id) as max_id FROM payment_vouchers"
//     );
//     const nextId = result[0].max_id + 1;
//     const insertQuery =
//       "INSERT INTO payment_vouchers" +
//       "(voucher_id, customer_id, amount_to_be_paid, paid, voucher_created_at,payment_made_at)" +
//       "VALUES (?, ?, ?, ?, ?, ?)";
//     const values = [nextId, customer_id, amount_to_be_paid, 0, Date.now, null];
//     result = await con.execute(insertQuery, values);

//     res.status(200).json({
//       message: "Customer created successfully!",
//       voucher: {
//         voucher_id: nextId,
//         customer_id: customer_id,
//         amount_to_be_paid: amount_to_be_paid,
//         paid: 0,
//         voucher_created_at: Date.now,
//         payment_made_at: null,
//       },
//     });

//     await con.end();
//   } catch (error) {
//     console.log("Error:", error);
//     res.status(500).json({ error: error });
//   }
// };

exports.setNewPayment = async (req, res) => {
  // const { customer_id, amount_to_be_paid } = req.body;
  // console.log(req.body);
  // const { error } = Check.check("newPayment", req.body);
  // if (error) {
  //   console.log("line14", error.details[0].message);
  //   res.status(400).send(error.details[0].message);
  //   return;
  // }
  // try {
  //   // Initialize your MySQL connection
  //   const rows1 = await con.execute(
  //     "SELECT * FROM identification_customers WHERE customer_id = ?",
  //     [customer_id]
  //   );
  //   if (!rows1 || rows1.length === 0) {
  //     res.status(404).json({ error: "Customer not found" });
  //     await con.end();
  //     return;
  //   }
  //   let [result] = await con.execute(
  //     "SELECT MAX(voucher_id) as max_id FROM payment_vouchers"
  //   );
  //   const nextId = result[0].max_id + 1;
  //   const insertQuery =
  //     "INSERT INTO payment_vouchers" +
  //     "(voucher_id, customer_id, amount_to_be_paid, paid, voucher_created_at, payment_made_at)" +
  //     "VALUES (?, ?, ?, ?, ?, ?)";
  //   const values = [
  //     nextId,
  //     customer_id,
  //     amount_to_be_paid,
  //     0,
  //     Date.now(), // Format the timestamp
  //     null,
  //   ];
  //   await con.execute(insertQuery, values); // Await the query execution
  //   res.status(200).json({
  //     message: "Payment created successfully!",
  //     voucher: {
  //       voucher_id: nextId,
  //       customer_id: customer_id,
  //       amount_to_be_paid: amount_to_be_paid,
  //       paid: 0,
  //       voucher_created_at: Date.now(),
  //       payment_made_at: null,
  //     },
  //   });
  //   await con.end();
  // } catch (error) {
  //   console.log("Error:", error);
  //   res.status(500).json({ error: error });
  // }
  try {
    const { customer_id, amount_to_be_paid } = req.body;
    console.log(req.body);

    const { error } = Check.check("newPayment", req.body);
    if (error) {
      console.log("line14", error.details[0].message);
      return res.status(400).send(error.details[0].message);
    }

    con.query(
      "SELECT * FROM identification_customers WHERE customer_id = ?",
      [customer_id],
      async (err, rows1) => {
        if (err) {
          console.error("Error retrieving customer:", err);
          return res.status(500).json({ error: "Error retrieving customer" });
        }

        if (!rows1 || rows1.length === 0) {
          return res.status(404).json({ error: "Customer not found" });
        }

        con.query(
          "SELECT MAX(voucher_id) as max_id FROM payment_vouchers",
          async (err, result) => {
            if (err) {
              console.error("Error retrieving max voucher ID:", err);
              return res
                .status(500)
                .json({ error: "Error retrieving max voucher ID" });
            }

            const nextId = result[0].max_id + 1;
            const insertQuery =
              "INSERT INTO payment_vouchers" +
              "(voucher_id, customer_id, amount_to_be_paid, paid, voucher_created_at, payment_made_at)" +
              "VALUES (?, ?, ?, ?, NOW(), ?)";
            const values = [nextId, customer_id, amount_to_be_paid, 0, null];

            con.query(insertQuery, values, (err) => {
              if (err) {
                console.error("Error inserting payment:", err);
                return res
                  .status(500)
                  .json({ error: "Error inserting payment" });
              }

              res.status(200).json({
                message: "Payment created successfully!",
                voucher: {
                  voucher_id: nextId,
                  customer_id: customer_id,
                  amount_to_be_paid: amount_to_be_paid,
                  paid: 0,
                  voucher_created_at: Date.now(),
                  payment_made_at: null,
                },
              });
            });
          }
        );
      }
    );
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: error });
  }
};

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

exports.deleteVoucher = async (req, res) => {
  // const { voucherId } = req.params;

  // try {
  //   const deleteQuery =
  //     "DELETE FROM payment_vouchers WHERE voucher_id = $1 RETURNING *";
  //   const { rowCount } = await con.query(deleteQuery, [voucherId]);

  //   if (rowCount === 0) {
  //     res.status(404).json({ error: "Voucher not found." });
  //   } else {
  //     res.status(204).send(); // Send a success response with status code 204 (No Content)
  //   }
  // } catch (error) {
  //   console.error("Error deleting voucher:", error);
  //   res
  //     .status(500)
  //     .json({ error: "An error occurred while deleting the voucher." });
  // }
  // const { voucherId } = req.params;

  // try {
  //   const deleteQuery = 'DELETE FROM payment_vouchers WHERE voucher_id = ?';
  //   const [result] = await con.query(deleteQuery, [voucherId]);

  //   if (result.affectedRows === 0) {
  //     res.status(404).json({ error: 'Voucher not found.' });
  //   } else {
  //     res.status(204).send();
  //   }
  // } catch (error) {
  //   console.error('Error deleting voucher:', error);
  //   res.status(500).json({ error: 'An error occurred while deleting the voucher.' });
  // }

  exports.deleteVoucher = (req, res) => {
    const { voucherId } = req.params;

    const deleteQuery = "DELETE FROM payment_vouchers WHERE voucher_id = ?";
    con.query(deleteQuery, [voucherId], (error, result) => {
      if (error) {
        console.error("Error deleting voucher:", error);
        res
          .status(500)
          .json({ error: "An error occurred while deleting the voucher." });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: "Voucher not found." });
      } else {
        res.status(204).send();
      }
    });
  };
};
