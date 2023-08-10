const con = require("../config/database");
var Check = require("../models/check");

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

        res.status(200).json({ id: loginResult[0].customer_id });
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

// exports.createAppointments = async (req, res) => {
//   // const { error } = Check.check("createAppointments", req.body);
//   // if (error) {
//   //   console.log(error.details[0].message);
//   //   res.status(400).send(error.details[0].message);
//   //   return;
//   // }

//   const appointments = req.body;

// }

exports.createAppointments = async (req, res) => {
  const appointments = req.body.appointments;
  console.log(appointments);

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

// exports.createAppointments = async (req, res) => {
//   const appointments = req.body.appointments;
//   console.log(appointments);

//   try {
//     // Get the latest appointment_id from the appointments table
//     const getLastAppointmentIdQuery =
//       "SELECT MAX(appointment_id) AS max_id FROM appointments";
//     con.query(
//       getLastAppointmentIdQuery,
//       (getLastAppointmentIdErr, getLastAppointmentIdResult) => {
//         if (getLastAppointmentIdErr) {
//           console.error(
//             "Error getting last appointment_id:",
//             getLastAppointmentIdErr
//           );
//           res.status(500).json({ error: "Error getting last appointment_id" });
//           return;
//         }

//         const lastAppointmentId = getLastAppointmentIdResult[0].max_id || 0;
//         let newAppointmentId = lastAppointmentId + 1;

//         // Helper function to check if an appointment with the same date_time exists
//         const doesAppointmentExist = (date_time) => {
//           return new Promise((resolve, reject) => {
//             const checkAppointmentQuery =
//               "SELECT COUNT(*) AS count FROM appointments WHERE date_time = ?";
//             con.query(
//               checkAppointmentQuery,
//               [date_time],
//               (checkAppointmentErr, checkAppointmentResult) => {
//                 if (checkAppointmentErr) {
//                   reject(checkAppointmentErr);
//                 } else {
//                   resolve(checkAppointmentResult[0].count > 0);
//                 }
//               }
//             );
//           });
//         };

//         // Loop through each appointment and insert if it doesn't exist
//         const insertPromises = [];
//         for (const appointment of appointments) {
//           const formattedDateTime = new Date(appointment)
//             .toISOString()
//             .slice(0, 19)
//             .replace("T", " ");

//           doesAppointmentExist(formattedDateTime)
//             .then((appointmentExists) => {
//               if (!appointmentExists) {
//                 const insertAppointmentQuery =
//                   "INSERT INTO appointments (appointment_id, date_time) VALUES (?, ?)";
//                 const insertPromise = new Promise((resolve, reject) => {
//                   con.query(
//                     insertAppointmentQuery,
//                     [newAppointmentId, formattedDateTime],
//                     (insertAppointmentErr, insertAppointmentResult) => {
//                       if (insertAppointmentErr) {
//                         reject(insertAppointmentErr);
//                       } else {
//                         resolve();
//                       }
//                     }
//                   );
//                 });
//                 insertPromises.push(insertPromise);
//               }
//             })
//             .catch((error) => {
//               console.error("Error checking appointment existence:", error);
//               res
//                 .status(500)
//                 .json({ error: "Error checking appointment existence" });
//             });

//           newAppointmentId++; // Increment ID here
//         }

//         Promise.all(insertPromises)
//           .then(() => {
//             res.status(200).json({
//               message: "Appointments created successfully",
//               status: 200,
//             });
//           })
//           .catch((error) => {
//             console.error("Error inserting appointments:", error);
//             res.status(500).json({ error: "Error inserting appointments" });
//           });
//       }
//     );
//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).json({ error: "Error processing request" });
//   }
// };

// exports.createAppointments = async (req, res) => {
//   const appointments = req.body.appointments;
//   console.log(appointments);
//   try {
//     // Get the latest appointment_id from the appointments table
//     const getLastAppointmentIdQuery =
//       "SELECT MAX(appointment_id) AS max_id FROM appointments";
//     con.query(
//       getLastAppointmentIdQuery,
//       (getLastAppointmentIdErr, getLastAppointmentIdResult) => {
//         if (getLastAppointmentIdErr) {
//           console.error(
//             "Error getting last appointment_id:",
//             getLastAppointmentIdErr
//           );
//           res.status(500).json({ error: "Error getting last appointment_id" });
//           return;
//         }

//         const lastAppointmentId = getLastAppointmentIdResult[0].max_id || 0;
//         let newAppointmentId = lastAppointmentId + 1;

//         // Helper function to check if an appointment with the same date_time exists
//         const doesAppointmentExist = (date_time) => {
//           return new Promise((resolve, reject) => {
//             const checkAppointmentQuery =
//               "SELECT COUNT(*) AS count FROM appointments WHERE date_time = ?";
//             con.query(
//               checkAppointmentQuery,
//               [date_time],
//               (checkAppointmentErr, checkAppointmentResult) => {
//                 if (checkAppointmentErr) {
//                   reject(checkAppointmentErr);
//                 } else {
//                   resolve(checkAppointmentResult[0].count > 0);
//                 }
//               }
//             );
//           });
//         };

//         // Loop through each appointment and insert if it doesn't exist
//         const insertPromises = [];
//         for (const appointment of appointments) {
//           const formattedDateTime = new Date(appointment)
//             .toISOString()
//             .slice(0, 19)
//             .replace("T", " ");

//           doesAppointmentExist(formattedDateTime)
//             .then((appointmentExists) => {
//               if (!appointmentExists) {
//                 const insertAppointmentQuery =
//                   "INSERT INTO appointments (appointment_id, date_time) VALUES (?, ?)";
//                 const insertPromise = new Promise((resolve, reject) => {
//                   con.query(
//                     insertAppointmentQuery,
//                     [newAppointmentId, formattedDateTime],
//                     (insertAppointmentErr, insertAppointmentResult) => {
//                       if (insertAppointmentErr) {
//                         reject(insertAppointmentErr);
//                       } else {
//                         newAppointmentId++;
//                         resolve();
//                       }
//                     }
//                   );
//                 });
//                 insertPromises.push(insertPromise);
//               }
//             })
//             .catch((error) => {
//               console.error("Error checking appointment existence:", error);
//               res
//                 .status(500)
//                 .json({ error: "Error checking appointment existence" });
//             });
//         }

//         Promise.all(insertPromises)
//           .then(() => {
//             res.status(200).json({
//               message: "Appointments created successfully",
//               status: 200,
//             });
//           })
//           .catch((error) => {
//             console.error("Error inserting appointments:", error);
//             res.status(500).json({ error: "Error inserting appointments" });
//           });
//       }
//     );
//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).json({ error: "Error processing request" });
//   }
// };
