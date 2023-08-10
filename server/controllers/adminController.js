const con = require("../config/database");
var Check = require("../models/check");
const crypto = require("crypto");
const mysql = require("mysql2/promise");

function generateToken() {
  const tokenLength = 32;
  return crypto.randomBytes(tokenLength).toString("hex");
}

exports.loginAdmin = async (req, res) => {
  console.log("hi");
  const { username, password } = req.query;

  // Check if the username and password exist together in the database
  const loginQuery =
    "SELECT * FROM identification_customers natural join admin WHERE username = ?";
  con.query(loginQuery, [username], async (loginErr, loginResult) => {
    if (loginErr) {
      console.error("Error checking login credentials:", loginErr);

      res.status(500).json({ error: "Error checking login credentials" });
    }

    // If no user with the given username is found, return an error
    if (loginResult.length === 0) {
      console.log("Invalid credentials");

      res.status(404).json({ error: "Invalid credentials" });
      //res.send();
    }

    // Compare the provided password with the hashed password from the database
    const hashedPassword = loginResult[0].password;

    try {
      const isPasswordValid = password === hashedPassword;

      if (isPasswordValid) {
        // Passwords match, user is authenticated
        const newToken = generateToken();
        const insertTokenQuery =
          "UPDATE admin SET token = ? WHERE admin_id = ? ";
        const updateValues = [newToken, loginResult[0].customer_id];

        con.query(insertTokenQuery, updateValues, (error, results) => {
          if (error) {
            console.error("Error:", error);
          } else {
            console.log("Token inserted successfully.");

            res
              .status(200)
              .json({ id: loginResult[0].customer_id, token: newToken });
          }
          // Close the database connection
        });
      } else {
        // Passwords do not match, authentication failed
        res.status(401).json({ error: "Invalid credentials" });
        //res.send();
      }
    } catch (passwordError) {
      console.error("Error comparing passwords:", passwordError);
      res.status(500).json({ error: "Error comparing passwords" });
      //res.send();
    }
  });
};

exports.createAppointments = async (req, res) => {
  try {
    const security = await validateToken(req.query.token);
    if (!security) {
      res.status(400).json({ error: "you are not admin" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
    return;
  }
  const appointments = req.body.appointments;
  console.log(appointments);

  // const { error } = Check.check("createAppointments", req.body.appointments);
  // if (error) {
  //   console.log(error.details[0].message);
  //   res.status(400).send(error.details[0].message);
  //   return;
  // }

  try {
    // Loop through each appointment and insert if it doesn't exist
    const insertPromises = [];
    for (const appointment of appointments) {
      const formattedDateTime = new Date(appointment)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const doesAppointmentExist = await checkAppointmentExist(
        formattedDateTime
      );
      if (!doesAppointmentExist) {
        const insertAppointmentQuery =
          "INSERT INTO appointments (date_time) VALUES (?)";

        const insertPromise = new Promise((resolve, reject) => {
          con.query(
            insertAppointmentQuery,
            [formattedDateTime],
            (insertAppointmentErr, insertAppointmentResult) => {
              if (insertAppointmentErr) {
                reject(insertAppointmentErr);
              } else {
                resolve();
              }
            }
          );
        });

        insertPromises.push(insertPromise);
      }
    }

    await Promise.all(insertPromises);

    res.status(200).json({
      message: "Appointments created successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Error processing request" });
  }
};

async function checkAppointmentExist(date_time) {
  return new Promise((resolve, reject) => {
    const checkAppointmentQuery =
      "SELECT COUNT(*) AS count FROM appointments WHERE date_time = ?";
    con.query(
      checkAppointmentQuery,
      [date_time],
      (checkAppointmentErr, checkAppointmentResult) => {
        if (checkAppointmentErr) {
          reject(checkAppointmentErr);
        } else {
          resolve(checkAppointmentResult[0].count > 0);
        }
      }
    );
  });
}

exports.getAllUsers = async (req, res) => {
  try {
    const security = await validateToken(req.query.token);
    if (!security) {
      res.status(400).json({ error: "you are not admin" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
    return;
  }
  try {
    const getUsersQuery = "SELECT * FROM customer_information";
    con.query(getUsersQuery, (Err, Result) => {
      if (Err) {
        console.error("Error getting users", Err);
        res.status(500).json({ error: "Error getting customer appointments" });
        return;
      }

      res.status(200);
      res.send(JSON.stringify(Result));
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(503).json({ error: "Error processing request" });
  }
};

exports.getAllVouchers = async (req, res) => {
  try {
    const security = await validateToken(req.query.token);
    if (!security) {
      res.status(400).json({ error: "you are not admin" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
    return;
  }
  try {
    const getVouchersQuery = "SELECT * FROM payment_vouchers";
    con.query(getVouchersQuery, (Err, Result) => {
      if (Err) {
        console.error("Error getting users", Err);
        res.status(500).json({ error: "Error getting vouchers" });
        return;
      }

      res.status(200);
      res.send(JSON.stringify(Result));
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(503).json({ error: "Error processing request" });
  }
};

exports.AdminFutureAppointments = async (req, res) => {
  try {
    const security = await validateToken(req.query.token);
    if (!security) {
      res.status(400).json({ error: "you are not admin" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
    return;
  }
  try {
    const getFutureAppointmentsQuery = `
      SELECT 
        a.date_time,
        ca.customer_id,
        ca.additionalInfo,
        ci.name,
        ci.id_number,
        ci.phone,
        ci.email
      FROM appointments a
      LEFT JOIN customer_appointment ca ON a.appointment_id = ca.appointment_id
      LEFT JOIN customer_information ci ON ca.customer_id = ci.customer_id
    `;

    con.query(getFutureAppointmentsQuery, (queryErr, queryResult) => {
      if (queryErr) {
        console.error("Error fetching future appointments:", queryErr);
        res.status(500).json({ error: "Error fetching future appointments" });
        return;
      }

      const futureAppointments = queryResult.map((row) => {
        const appointment = {
          date_time: row.date_time,
          name: null,
          id_number: null,
          phone: null,
          email: null,
          additionalInfo: null,
          isOccupied: false,
        };

        if (row.customer_id) {
          appointment.name = row.name;
          appointment.id_number = row.id_number;
          appointment.phone = row.phone;
          appointment.email = row.email;
          appointment.additionalInfo = row.additionalInfo;
          appointment.isOccupied = true;
        }

        return appointment;
      });

      res.status(200).json({ futureAppointments });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Error processing request" });
  }
};
exports.deleteVoucher = async (req, res) => {
  try {
    const security = await validateToken(req.query.token);
    if (!security) {
      res.status(400).json({ error: "you are not admin" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
    return;
  }
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

exports.setNewPayment = async (req, res) => {
  try {
    const security = await validateToken(req.query.token);
    if (!security) {
      res.status(400).json({ error: "you are not admin" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
    return;
  }
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

async function validateToken(token) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM admin WHERE token = \'${token}\'`;
    console.log(query);

    con.query(query, (error, results, fields) => {
      if (error) {
        reject("Error executing the query: " + error.stack);
        return;
      }
      if (results.length > 0) resolve(true);
      else resolve(false);
    });
  });
}
