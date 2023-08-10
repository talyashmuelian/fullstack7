const con = require("../config/database");
var Check = require("../models/check");

exports.getAppointment = async (req, res) => {
  // console.log("hi");
  // const { username, password } = req.query;
  // // Check if the username and password exist together in the database
  // const loginQuery =
  //   "SELECT * FROM identification_customers WHERE username = ?";
  // con.query(loginQuery, [username], async (loginErr, loginResult) => {
  //   if (loginErr) {
  //     console.error("Error checking login credentials:", loginErr);
  //     res.status(500).json({ error: "Error checking login credentials" });
  //     res.send();
  //   }
  //   // If no user with the given username is found, return an error
  //   if (loginResult.length === 0) {
  //     console.log("Invalid credentials");
  //     res.status(404).json({ error: "Invalid credentials" });
  //     //res.send();
  //   }
  //   // Compare the provided password with the hashed password from the database
  //   const hashedPassword = loginResult[0].password;
  //   try {
  //     const isPasswordValid = password === hashedPassword;
  //     if (isPasswordValid) {
  //       // Passwords match, user is authenticated
  //       // res.status(200).json({ message: "Login successful", });
  //       res.status(200).json({ id: loginResult[0].customer_id });
  //       res.send();
  //     } else {
  //       // Passwords do not match, authentication failed
  //       res.status(401).json({ error: "Invalid credentials" });
  //       //res.send();
  //     }
  //   } catch (passwordError) {
  //     console.error("Error comparing passwords:", passwordError);
  //     res.status(500).json({ error: "Error comparing passwords" });
  //     //res.send();
  //   }
  // });
};

exports.getAvailableAppointments = async (req, res) => {
  console.log("hi");
  try {
    // Get the current date and time
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Query to get available appointments in the future
    const query =
      "SELECT a.appointment_id, a.date_time " +
      "FROM appointments a " +
      "LEFT JOIN customer_appointment ca ON a.appointment_id = ca.appointment_id " +
      "WHERE ca.customer_appointment_id IS NULL AND a.date_time > ?";

    // Execute the query
    con.query(query, [currentDate], (err, result) => {
      if (err) {
        console.error("Error fetching available appointments:", err);
        res
          .status(500)
          .json({ error: "Error fetching available appointments" });
        return;
      }
      console.log("line65");
      // Available appointments found, send them in the response
      res.status(200).json(result); //{ availableAppointments: result }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Error processing request" });
  }
};

exports.getOccupiedAppointments = async (req, res) => {
  try {
    // Get the current date and time
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Query to get available appointments in the future
    const query =
      "SELECT a.appointment_id, a.date_time " +
      "FROM appointments a " +
      "LEFT JOIN customer_appointment ca ON a.appointment_id = ca.appointment_id " +
      "WHERE ca.customer_appointment_id IS NOT NULL AND a.date_time > ?";

    // Execute the query
    con.query(query, [currentDate], (err, result) => {
      if (err) {
        console.error("Error fetching available appointments:", err);
        res
          .status(500)
          .json({ error: "Error fetching available appointments" });
        return;
      }

      // Available appointments found, send them in the response
      res.status(200).json(result);
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Error processing request" });
  }
};

exports.getFutureAppointmentsForCus = async (req, res) => {
  console.log("line108");
  const customer_id = req.params.customerID;
  console.log("line109");
  console.log(customer_id);
  try {
    // Query to get future appointments for the given customer_id
    const query =
      "SELECT ca.customer_appointment_id, ca.customer_id, ca.appointment_id, ca.reminder, ca.additionalInfo, a.date_time " +
      "FROM customer_appointment ca " +
      "INNER JOIN appointments a ON ca.appointment_id = a.appointment_id " +
      "WHERE ca.customer_id = ? AND a.date_time > NOW() " +
      "ORDER BY a.date_time ASC";

    // Execute the query with customer_id as a parameter
    con.query(query, [customer_id], (err, result) => {
      if (err) {
        console.error("Error fetching future appointments:", err);
        res.status(500).json({ error: "Error fetching future appointments" });
        return;
      }

      // If no future appointments are found for the given customer_id, return an empty array
      if (result.length === 0) {
        res
          .status(404)
          .json({ error: "No future appointments found for the customer" });
        return;
      }

      // Future appointments found, send them in the response
      res.status(200).json(result); //{ futureAppointments: result }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Error processing request" });
  }
};

exports.getHistoryAppointmentsForCus = async (req, res) => {
  const customer_id = req.params.customer_id;

  try {
    // Get all customer_appointments for the given customer_id
    const getAppointmentsQuery =
      "SELECT appointment_id FROM customer_appointment WHERE customer_id = ?";
    con.query(
      getAppointmentsQuery,
      [customer_id],
      (getAppointmentsErr, getAppointmentsResult) => {
        if (getAppointmentsErr) {
          console.error(
            "Error getting customer appointments:",
            getAppointmentsErr
          );
          res
            .status(500)
            .json({ error: "Error getting customer appointments" });
          return;
        }
        console.log(customer_id);
        console.log(getAppointmentsResult);
        // Extract all appointment_ids for the given customer
        const appointmentIds = getAppointmentsResult.map(
          (appointment) => appointment.appointment_id
        );

        // Get all appointments whose date has already passed
        const currentDate = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        const getHistoryAppointmentsQuery =
          "SELECT * FROM appointments WHERE appointment_id IN (?) AND date_time < ?";
        console.log(currentDate);
        console.log(appointmentIds);
        con.query(
          getHistoryAppointmentsQuery,
          [appointmentIds, currentDate],
          (getHistoryAppointmentsErr, getHistoryAppointmentsResult) => {
            if (getHistoryAppointmentsErr) {
              console.error(
                "Error getting history appointments:",
                getHistoryAppointmentsErr
              );
              res
                .status(501)
                .json({ error: "Error getting history appointments" });
              return;
            }

            // Return the history appointments for the given customer
            res.status(200).json(getHistoryAppointmentsResult); //{ history_appointments: getHistoryAppointmentsResult }
          }
        );
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(503).json({ error: "Error processing request" });
  }
};

exports.makeAppointment = async (req, res) => {
  const { error } = Check.check("appointments", req.body);
  if (error) {
    console.log(error.details[0].message);
    res.status(400).send(error.details[0].message);
    return;
  }

  const { customer_id, appointment_id, reminder, additionalInfo } = req.body;

  try {
    // Check if the appointment_id exists in the appointments table
    const checkAppointmentQuery =
      "SELECT * FROM appointments WHERE appointment_id = ?";
    con.query(
      checkAppointmentQuery,
      [appointment_id],
      (checkAppErr, checkAppResult) => {
        if (checkAppErr) {
          console.error("Error checking appointment:", checkAppErr);
          res.status(500).json({ error: "Error checking appointment" });
          return;
        }

        // If appointment_id doesn't exist in appointments table, return an error
        if (checkAppResult.length === 0) {
          res.status(404).json({ error: "Invalid appointment_id" });
          return;
        }

        // Check if the appointment_id already exists for the given customer in customer_appointment table
        const checkCustomerAppointmentQuery =
          "SELECT * FROM customer_appointment WHERE appointment_id = ?";
        con.query(
          checkCustomerAppointmentQuery,
          [appointment_id],
          (checkCustAppErr, checkCustAppResult) => {
            if (checkCustAppErr) {
              console.error(
                "Error checking customer appointment:",
                checkCustAppErr
              );
              res
                .status(500)
                .json({ error: "Error checking customer appointment" });
              return;
            }

            // If appointment_id already exists for any customer, return an error
            if (checkCustAppResult.length > 0) {
              res.status(409).json({
                error: "Appointment already exists for another customer",
              });
              return;
            }

            // Get the next customer_appointment_id
            const getNextIdQuery =
              "SELECT MAX(customer_appointment_id) as maxId FROM customer_appointment";
            con.query(getNextIdQuery, (maxIdErr, maxIdResult) => {
              if (maxIdErr) {
                console.error(
                  "Error getting next customer appointment ID:",
                  maxIdErr
                );
                res.status(500).json({
                  error: "Error getting next customer appointment ID",
                });
                return;
              }

              const nextId = maxIdResult[0].maxId + 1;

              // Insert the new appointment in the customer_appointment table
              const insertQuery =
                "INSERT INTO customer_appointment (customer_appointment_id, customer_id, appointment_id, reminder, additionalInfo) VALUES (?, ?, ?, ?, ?)";
              con.query(
                insertQuery,
                [nextId, customer_id, appointment_id, reminder, additionalInfo],
                (insertErr, insertResult) => {
                  if (insertErr) {
                    console.error("Error inserting appointment:", insertErr);
                    res
                      .status(500)
                      .json({ error: "Error inserting appointment" });
                    return;
                  }

                  // Appointment added successfully
                  res
                    .status(200)
                    .json({ message: "Appointment added successfully" });
                }
              );
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Error processing request" });
  }
};

exports.cancelAppointment = async (req, res) => {
  const appointment_id = req.params.appointment_id;

  try {
    // Check if the appointment_id exists in the customer_appointment table
    const checkAppointmentQuery =
      "SELECT appointment_id FROM customer_appointment WHERE appointment_id = ?";
    con.query(
      checkAppointmentQuery,
      [appointment_id],
      (checkAppointmentErr, checkAppointmentResult) => {
        if (checkAppointmentErr) {
          console.error("Error checking appointment:", checkAppointmentErr);
          res.status(500).json({ error: "Error checking appointment" });
          return;
        }

        // If appointment_id doesn't exist, return an error
        if (checkAppointmentResult.length === 0) {
          res.status(404).json({ error: "Appointment not found" });
          return;
        }

        // Delete the row from the customer_appointment table
        const deleteAppointmentQuery =
          "DELETE FROM customer_appointment WHERE appointment_id = ?";
        con.query(
          deleteAppointmentQuery,
          [appointment_id],
          (deleteAppointmentErr, deleteAppointmentResult) => {
            if (deleteAppointmentErr) {
              console.error(
                "Error deleting appointment:",
                deleteAppointmentErr
              );
              res.status(500).json({ error: "Error deleting appointment" });
              return;
            }

            // Appointment deleted successfully
            res.status(200).json({
              message: "Appointment canceled successfully",
              status: 200,
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Error processing request" });
  }
};

exports.putReplaceAppointment = async (req, res) => {
  const appointment_id_1 = req.params.sender_appointment_id;
  const appointment_id_2 = req.params.recipient_appointment_id;
  console.log(appointment_id_1);
  console.log(appointment_id_2);
  try {
    // Get the information of the rows with appointment_id_1 and appointment_id_2
    const getAppointmentInfoQuery =
      "SELECT customer_id, reminder, additionalInfo FROM customer_appointment WHERE appointment_id IN (?, ?)";
    con.query(
      getAppointmentInfoQuery,
      [appointment_id_1, appointment_id_2],
      (getAppointmentInfoErr, getAppointmentInfoResult) => {
        if (getAppointmentInfoErr) {
          console.error(
            "Error getting appointment information:",
            getAppointmentInfoErr
          );
          res
            .status(500)
            .json({ error: "Error getting appointment information" });
          return;
        }

        // Check if both appointment_id_1 and appointment_id_2 exist
        if (getAppointmentInfoResult.length !== 2) {
          res.status(404).json({ error: "One or both appointments not found" });
          return;
        }

        const appointment1Info = getAppointmentInfoResult[1];
        const appointment2Info = getAppointmentInfoResult[0];
        console.log(appointment1Info);
        console.log(appointment2Info);
        // Extract information from the rows
        //const appointment1Info = getAppointmentInfoResult.find((appointment) => appointment.appointment_id === appointment_id_1);
        //const appointment2Info = getAppointmentInfoResult.find((appointment) => appointment.appointment_id === appointment_id_2);

        // Perform the exchange of information
        const exchangeInfoQuery =
          "UPDATE customer_appointment SET customer_id = ?, reminder = ?, additionalInfo = ? WHERE appointment_id = ?";
        con.query(
          exchangeInfoQuery,
          [
            appointment2Info.customer_id,
            appointment2Info.reminder,
            appointment2Info.additionalInfo,
            appointment_id_1,
          ],
          (exchangeInfoErr, exchangeInfoResult) => {
            if (exchangeInfoErr) {
              console.error(
                "Error exchanging appointment information:",
                exchangeInfoErr
              );
              res
                .status(500)
                .json({ error: "Error exchanging appointment information" });
              return;
            }

            // Update the second appointment with the information from the first appointment
            con.query(
              exchangeInfoQuery,
              [
                appointment1Info.customer_id,
                appointment1Info.reminder,
                appointment1Info.additionalInfo,
                appointment_id_2,
              ],
              (updateAppointment2Err, updateAppointment2Result) => {
                if (updateAppointment2Err) {
                  console.error(
                    "Error updating second appointment:",
                    updateAppointment2Err
                  );
                  res
                    .status(500)
                    .json({ error: "Error updating second appointment" });
                  return;
                }
                //החלק של למחוק בקשות שכבר לא רלוונטיות לא עובד, אני עוברת הלאה
                // Appointments exchanged successfully
                // Now, access customer_appointment table again to get updated customer IDs
                const getUpdatedCustomerIDsQuery =
                  "SELECT customer_id, appointment_id FROM customer_appointment WHERE appointment_id IN (?, ?)";
                con.query(
                  getUpdatedCustomerIDsQuery,
                  [appointment_id_1, appointment_id_2],
                  (getUpdatedCustomerIDsErr, getUpdatedCustomerIDsResult) => {
                    if (getUpdatedCustomerIDsErr) {
                      console.error(
                        "Error getting updated customer IDs:",
                        getUpdatedCustomerIDsErr
                      );
                      res
                        .status(500)
                        .json({ error: "Error getting updated customer IDs" });
                      return;
                    }

                    // Get updated customer IDs
                    const updatedCustomerID1 = getUpdatedCustomerIDsResult.find(
                      (appointment) =>
                        appointment.appointment_id === appointment_id_1
                    )?.customer_id;
                    const updatedCustomerID2 = getUpdatedCustomerIDsResult.find(
                      (appointment) =>
                        appointment.appointment_id === appointment_id_2
                    )?.customer_id;

                    // Now, delete rows from requests table where sender_appointment_id or recipient_appointment_id no longer belong to their respective client_id
                    const deleteInvalidRequestsQuery =
                      "DELETE FROM requests WHERE (sender_client_id = ? AND sender_appointment_id = ?) OR (recipient_client_id = ? AND recipient_appointment_id = ?)";
                    con.query(
                      deleteInvalidRequestsQuery,
                      [
                        updatedCustomerID1,
                        appointment_id_1,
                        updatedCustomerID2,
                        appointment_id_2,
                      ],
                      (
                        deleteInvalidRequestsErr,
                        deleteInvalidRequestsResult
                      ) => {
                        if (deleteInvalidRequestsErr) {
                          console.error(
                            "Error deleting invalid requests:",
                            deleteInvalidRequestsErr
                          );
                          res
                            .status(500)
                            .json({ error: "Error deleting invalid requests" });
                          return;
                        }

                        // Invalid requests deleted successfully
                        res.status(200).json({
                          message:
                            "Appointments exchanged and invalid requests deleted successfully",
                          status: 200,
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Error processing request" });
  }
};

// exports.putReplaceAppointment = async (req, res) => {
//   const appointment_id_1 = req.params.sender_appointment_id;
//   const appointment_id_2 = req.params.recipient_appointment_id;
//   console.log(appointment_id_1);
//   console.log(appointment_id_2);
//   try {
//     // Get the information of the rows with appointment_id_1 and appointment_id_2
//     const getAppointmentInfoQuery =
//       "SELECT customer_id, reminder, additionalInfo FROM customer_appointment WHERE appointment_id IN (?, ?)";
//     con.query(
//       getAppointmentInfoQuery,
//       [appointment_id_1, appointment_id_2],
//       (getAppointmentInfoErr, getAppointmentInfoResult) => {
//         if (getAppointmentInfoErr) {
//           console.error(
//             "Error getting appointment information:",
//             getAppointmentInfoErr
//           );
//           res
//             .status(500)
//             .json({ error: "Error getting appointment information" });
//           return;
//         }

//         // Check if both appointment_id_1 and appointment_id_2 exist
//         if (getAppointmentInfoResult.length !== 2) {
//           res.status(404).json({ error: "One or both appointments not found" });
//           return;
//         }

//         const appointment1Info = getAppointmentInfoResult[1]; //rec
//         const appointment2Info = getAppointmentInfoResult[0]; //sender
//         console.log(appointment1Info);
//         console.log(appointment2Info);

//         // Extract information from the rows
//         // const appointment1Info = getAppointmentInfoResult.find((appointment) => appointment.appointment_id === appointment_id_1);
//         // const appointment2Info = getAppointmentInfoResult.find((appointment) => appointment.appointment_id === appointment_id_2);

//         // Perform the exchange of information
//         const exchangeInfoQuery =
//           "UPDATE customer_appointment SET customer_id = ?, reminder = ?, additionalInfo = ? WHERE appointment_id = ?";
//         con.query(
//           exchangeInfoQuery,
//           [
//             appointment2Info.customer_id,
//             appointment2Info.reminder,
//             appointment2Info.additionalInfo,
//             appointment_id_1, //7
//           ],
//           (exchangeInfoErr, exchangeInfoResult) => {
//             if (exchangeInfoErr) {
//               console.error(
//                 "Error exchanging appointment information:",
//                 exchangeInfoErr
//               );
//               res
//                 .status(500)
//                 .json({ error: "Error exchanging appointment information" });
//               return;
//             }

//             // Update the second appointment with the information from the first appointment
//             con.query(
//               exchangeInfoQuery,
//               [
//                 appointment1Info.customer_id,
//                 appointment1Info.reminder,
//                 appointment1Info.additionalInfo,
//                 appointment_id_2, //3
//               ],
//               (updateAppointment2Err, updateAppointment2Result) => {
//                 if (updateAppointment2Err) {
//                   console.error(
//                     "Error updating second appointment:",
//                     updateAppointment2Err
//                   );
//                   res
//                     .status(500)
//                     .json({ error: "Error updating second appointment" });
//                   return;
//                 }

//                 // Appointments exchanged successfully
//                 // Now, delete rows from requests table where sender_appointment_id or recipient_appointment_id no longer belong to their respective client_id
//                 const deleteInvalidRequestsQuery =
//                   "DELETE FROM requests WHERE (sender_client_id = ? AND sender_appointment_id =?) OR (recipient_client_id = ? AND recipient_appointment_id =?)";
//                 //"DELETE FROM requests WHERE (sender_client_id = ? AND sender_appointment_id NOT IN (?, ?)) OR (recipient_client_id = ? AND recipient_appointment_id NOT IN (?, ?))";
//                 con.query(
//                   deleteInvalidRequestsQuery,
//                   [
//                     appointment1Info.customer_id,
//                     appointment_id_1,
//                     //appointment_id_2,
//                     appointment2Info.customer_id,
//                     //appointment_id_1,
//                     appointment_id_2,
//                   ],
//                   (deleteInvalidRequestsErr, deleteInvalidRequestsResult) => {
//                     if (deleteInvalidRequestsErr) {
//                       console.error(
//                         "Error deleting invalid requests:",
//                         deleteInvalidRequestsErr
//                       );
//                       res
//                         .status(500)
//                         .json({ error: "Error deleting invalid requests" });
//                       return;
//                     }

//                     // Invalid requests deleted successfully
//                     res.status(200).json({
//                       message:
//                         "Appointments exchanged and invalid requests deleted successfully",
//                       status: 200,
//                     });
//                   }
//                 );
//               }
//             );
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).json({ error: "Error processing request" });
//   }
// };

exports.getFutureAppointments = async (req, res) => {
  // console.log("hi");
  // const { username, password } = req.query;
  // // Check if the username and password exist together in the database
  // const loginQuery =
  //   "SELECT * FROM identification_customers WHERE username = ?";
  // con.query(loginQuery, [username], async (loginErr, loginResult) => {
  //   if (loginErr) {
  //     console.error("Error checking login credentials:", loginErr);
  //     res.status(500).json({ error: "Error checking login credentials" });
  //     res.send();
  //   }
  //   // If no user with the given username is found, return an error
  //   if (loginResult.length === 0) {
  //     console.log("Invalid credentials");
  //     res.status(404).json({ error: "Invalid credentials" });
  //     //res.send();
  //   }
  //   // Compare the provided password with the hashed password from the database
  //   const hashedPassword = loginResult[0].password;
  //   try {
  //     const isPasswordValid = password === hashedPassword;
  //     if (isPasswordValid) {
  //       // Passwords match, user is authenticated
  //       // res.status(200).json({ message: "Login successful", });
  //       res.status(200).json({ id: loginResult[0].customer_id });
  //       res.send();
  //     } else {
  //       // Passwords do not match, authentication failed
  //       res.status(401).json({ error: "Invalid credentials" });
  //       //res.send();
  //     }
  //   } catch (passwordError) {
  //     console.error("Error comparing passwords:", passwordError);
  //     res.status(500).json({ error: "Error comparing passwords" });
  //     //res.send();
  //   }
  // });
};

exports.getAllFutureAppointments = async (req, res) => {
  // console.log("hi");
  // const { username, password } = req.query;
  // // Check if the username and password exist together in the database
  // const loginQuery =
  //   "SELECT * FROM identification_customers WHERE username = ?";
  // con.query(loginQuery, [username], async (loginErr, loginResult) => {
  //   if (loginErr) {
  //     console.error("Error checking login credentials:", loginErr);
  //     res.status(500).json({ error: "Error checking login credentials" });
  //     res.send();
  //   }
  //   // If no user with the given username is found, return an error
  //   if (loginResult.length === 0) {
  //     console.log("Invalid credentials");
  //     res.status(404).json({ error: "Invalid credentials" });
  //     //res.send();
  //   }
  //   // Compare the provided password with the hashed password from the database
  //   const hashedPassword = loginResult[0].password;
  //   try {
  //     const isPasswordValid = password === hashedPassword;
  //     if (isPasswordValid) {
  //       // Passwords match, user is authenticated
  //       // res.status(200).json({ message: "Login successful", });
  //       res.status(200).json({ id: loginResult[0].customer_id });
  //       res.send();
  //     } else {
  //       // Passwords do not match, authentication failed
  //       res.status(401).json({ error: "Invalid credentials" });
  //       //res.send();
  //     }
  //   } catch (passwordError) {
  //     console.error("Error comparing passwords:", passwordError);
  //     res.status(500).json({ error: "Error comparing passwords" });
  //     //res.send();
  //   }
  // });
};

exports.getHistoryAppointments = async (req, res) => {
  // console.log("hi");
  // const { username, password } = req.query;
  // // Check if the username and password exist together in the database
  // const loginQuery =
  //   "SELECT * FROM identification_customers WHERE username = ?";
  // con.query(loginQuery, [username], async (loginErr, loginResult) => {
  //   if (loginErr) {
  //     console.error("Error checking login credentials:", loginErr);
  //     res.status(500).json({ error: "Error checking login credentials" });
  //     res.send();
  //   }
  //   // If no user with the given username is found, return an error
  //   if (loginResult.length === 0) {
  //     console.log("Invalid credentials");
  //     res.status(404).json({ error: "Invalid credentials" });
  //     //res.send();
  //   }
  //   // Compare the provided password with the hashed password from the database
  //   const hashedPassword = loginResult[0].password;
  //   try {
  //     const isPasswordValid = password === hashedPassword;
  //     if (isPasswordValid) {
  //       // Passwords match, user is authenticated
  //       // res.status(200).json({ message: "Login successful", });
  //       res.status(200).json({ id: loginResult[0].customer_id });
  //       res.send();
  //     } else {
  //       // Passwords do not match, authentication failed
  //       res.status(401).json({ error: "Invalid credentials" });
  //       //res.send();
  //     }
  //   } catch (passwordError) {
  //     console.error("Error comparing passwords:", passwordError);
  //     res.status(500).json({ error: "Error comparing passwords" });
  //     //res.send();
  //   }
  // });
};
