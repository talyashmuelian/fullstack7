const con = require("../config/database");
var Check = require("../models/check");

exports.postCreateNewRequest = async (req, res) => {
  const { sender_client_id, recipient_appointment_id, sender_appointment_id } =
    req.body;

  try {
    // Check if sender_client_id exists in the customer_information table
    const checkSenderClientQuery =
      "SELECT customer_id FROM customer_information WHERE customer_id = ?";
    con.query(
      checkSenderClientQuery,
      [sender_client_id],
      (checkSenderClientErr, checkSenderClientResult) => {
        if (checkSenderClientErr) {
          console.error("Error checking sender client:", checkSenderClientErr);
          res.status(500).json({ error: "Error checking sender client" });
          return;
        }

        // If sender_client_id doesn't exist, return an error
        if (checkSenderClientResult.length === 0) {
          res.status(404).json({ error: "Sender client not found" });
          return;
        }

        // Extract the recipient_client_id from the customer_appointment table
        const getRecipientClientIdQuery =
          "SELECT customer_id as recipient_client_id FROM customer_appointment WHERE appointment_id = ?";
        con.query(
          getRecipientClientIdQuery,
          [recipient_appointment_id],
          (recipientIdErr, recipientIdResult) => {
            if (recipientIdErr) {
              console.error(
                "Error getting recipient client ID:",
                recipientIdErr
              );
              res
                .status(500)
                .json({ error: "Error getting recipient client ID" });
              return;
            }

            const recipient_client_id =
              recipientIdResult[0].recipient_client_id;

            // Check if sender_client_id and recipient_client_id are equal
            if (sender_client_id === recipient_client_id) {
              res
                .status(400)
                .json({ error: "A request cannot be sent to yourself" });
              return;
            }

            // Check if sender_appointment_id and recipient_appointment_id exist in the appointments table
            const checkAppointmentsQuery =
              "SELECT appointment_id FROM appointments WHERE appointment_id IN (?, ?)";
            con.query(
              checkAppointmentsQuery,
              [sender_appointment_id, recipient_appointment_id],
              (checkAppointmentsErr, checkAppointmentsResult) => {
                if (checkAppointmentsErr) {
                  console.error(
                    "Error checking appointments:",
                    checkAppointmentsErr
                  );
                  res
                    .status(500)
                    .json({ error: "Error checking appointments" });
                  return;
                }

                // If any of the appointments don't exist, return an error
                if (checkAppointmentsResult.length < 2) {
                  res
                    .status(404)
                    .json({ error: "One or both appointments not found" });
                  return;
                }

                // Get the next request_id
                const getNextIdQuery =
                  "SELECT MAX(request_id) as maxId FROM requests";
                con.query(getNextIdQuery, (maxIdErr, maxIdResult) => {
                  if (maxIdErr) {
                    console.error("Error getting next request ID:", maxIdErr);
                    res
                      .status(500)
                      .json({ error: "Error getting next request ID" });
                    return;
                  }

                  const nextId = maxIdResult[0].maxId + 1;

                  // Check if the row already exists in the requests table
                  const checkExistingRowQuery =
                    "SELECT * FROM requests WHERE sender_client_id = ? AND recipient_client_id = ? AND recipient_appointment_id = ? AND sender_appointment_id = ?";
                  con.query(
                    checkExistingRowQuery,
                    [
                      sender_client_id,
                      recipient_client_id,
                      recipient_appointment_id,
                      sender_appointment_id,
                    ],
                    (checkRowErr, checkRowResult) => {
                      if (checkRowErr) {
                        console.error(
                          "Error checking existing row:",
                          checkRowErr
                        );
                        res
                          .status(500)
                          .json({ error: "Error checking existing row" });
                        return;
                      }

                      // If the row already exists, return a success response without inserting a new row
                      if (checkRowResult.length > 0) {
                        res
                          .status(201)
                          .json({ message: "Request already exists" });
                        return;
                      }

                      // Insert the new request in the requests table
                      const insertQuery =
                        "INSERT INTO requests (request_id, sender_client_id, recipient_client_id, recipient_appointment_id, sender_appointment_id) VALUES (?, ?, ?, ?, ?)";
                      con.query(
                        insertQuery,
                        [
                          nextId,
                          sender_client_id,
                          recipient_client_id,
                          recipient_appointment_id,
                          sender_appointment_id,
                        ],
                        (insertErr, insertResult) => {
                          if (insertErr) {
                            console.error(
                              "Error inserting request:",
                              insertErr
                            );
                            res
                              .status(500)
                              .json({ error: "Error inserting request" });
                            return;
                          }

                          // Request added successfully
                          res
                            .status(200)
                            .json({ message: "Request added successfully" });
                        }
                      );
                    }
                  );
                });
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

// exports.postCreateNewRequest = async (req, res) => {
//   const { error } = Check.check("requests", req.body);
//   if (error) {
//     console.log(error.details[0].message);
//     res.status(400).send(error.details[0].message);
//     return;
//   }
//   const { sender_client_id, recipient_appointment_id, sender_appointment_id } =
//     req.body;

//   try {
//     // Check if sender_client_id and recipient_client_id exist in the customer_information table
//     const checkClientsQuery =
//       "SELECT customer_id FROM customer_information WHERE customer_id IN (?, ?)";
//     con.query(
//       checkClientsQuery,
//       [sender_client_id, recipient_appointment_id],
//       (checkClientsErr, checkClientsResult) => {
//         if (checkClientsErr) {
//           console.error("Error checking clients:", checkClientsErr);
//           res.status(500).json({ error: "Error checking clients" });
//           return;
//         }

//         // If any of the clients don't exist, return an error
//         if (checkClientsResult.length < 2) {
//           res.status(404).json({ error: "One or both clients not found" });
//           return;
//         }

//         // Check if sender_appointment_id and recipient_appointment_id exist in the appointments table
//         const checkAppointmentsQuery =
//           "SELECT appointment_id FROM appointments WHERE appointment_id IN (?, ?)";
//         con.query(
//           checkAppointmentsQuery,
//           [sender_appointment_id, recipient_appointment_id],
//           (checkAppointmentsErr, checkAppointmentsResult) => {
//             if (checkAppointmentsErr) {
//               console.error(
//                 "Error checking appointments:",
//                 checkAppointmentsErr
//               );
//               res.status(500).json({ error: "Error checking appointments" });
//               return;
//             }

//             // If any of the appointments don't exist, return an error
//             if (checkAppointmentsResult.length < 2) {
//               res
//                 .status(404)
//                 .json({ error: "One or both appointments not found" });
//               return;
//             }

//             // Get the next request_id
//             const getNextIdQuery =
//               "SELECT MAX(request_id) as maxId FROM requests";
//             con.query(getNextIdQuery, (maxIdErr, maxIdResult) => {
//               if (maxIdErr) {
//                 console.error("Error getting next request ID:", maxIdErr);
//                 res
//                   .status(500)
//                   .json({ error: "Error getting next request ID" });
//                 return;
//               }

//               const nextId = maxIdResult[0].maxId + 1;

//               // Extract the recipient_client_id from the customer_appointment table
//               const getRecipientClientIdQuery =
//                 "SELECT customer_id as recipient_client_id FROM customer_appointment WHERE appointment_id = ?";
//               con.query(
//                 getRecipientClientIdQuery,
//                 [recipient_appointment_id],
//                 (recipientIdErr, recipientIdResult) => {
//                   if (recipientIdErr) {
//                     console.error(
//                       "Error getting recipient client ID:",
//                       recipientIdErr
//                     );
//                     res
//                       .status(500)
//                       .json({ error: "Error getting recipient client ID" });
//                     return;
//                   }

//                   const recipient_client_id =
//                     recipientIdResult[0].recipient_client_id;

//                   // Check if the row already exists in the requests table
//                   const checkExistingRowQuery =
//                     "SELECT * FROM requests WHERE sender_client_id = ? AND recipient_client_id = ? AND recipient_appointment_id = ? AND sender_appointment_id = ?";
//                   con.query(
//                     checkExistingRowQuery,
//                     [
//                       sender_client_id,
//                       recipient_client_id,
//                       recipient_appointment_id,
//                       sender_appointment_id,
//                     ],
//                     (checkRowErr, checkRowResult) => {
//                       if (checkRowErr) {
//                         console.error(
//                           "Error checking existing row:",
//                           checkRowErr
//                         );
//                         res
//                           .status(501)
//                           .json({ error: "Error checking existing row" });
//                         return;
//                       }

//                       // If the row already exists, return a success response without inserting a new row
//                       if (checkRowResult.length > 0) {
//                         res
//                           .status(201)
//                           .json({ message: "Request already exists" });
//                         return;
//                       }

//                       // Insert the new request in the requests table
//                       const insertQuery =
//                         "INSERT INTO requests (request_id, sender_client_id, recipient_client_id, recipient_appointment_id, sender_appointment_id) VALUES (?, ?, ?, ?, ?)";
//                       con.query(
//                         insertQuery,
//                         [
//                           nextId,
//                           sender_client_id,
//                           recipient_client_id,
//                           recipient_appointment_id,
//                           sender_appointment_id,
//                         ],
//                         (insertErr, insertResult) => {
//                           if (insertErr) {
//                             console.error(
//                               "Error inserting request:",
//                               insertErr
//                             );
//                             res
//                               .status(500)
//                               .json({ error: "Error inserting request" });
//                             return;
//                           }

//                           // Request added successfully
//                           res
//                             .status(200)
//                             .json({ message: "Request added successfully" });
//                         }
//                       );
//                     }
//                   );
//                 }
//               );
//             });
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).json({ error: "Error processing request" });
//   }
// };

// exports.postCreateNewRequest = async (req, res) => {
//   const { sender_client_id, recipient_appointment_id, sender_appointment_id } =
//     req.body;

//   try {
//     // Check if sender_client_id and recipient_client_id exist in the customer_information table
//     const checkClientsQuery =
//       "SELECT customer_id FROM customer_information WHERE customer_id IN (?, ?)";
//     con.query(
//       checkClientsQuery,
//       [sender_client_id, recipient_appointment_id],
//       (checkClientsErr, checkClientsResult) => {
//         if (checkClientsErr) {
//           console.error("Error checking clients:", checkClientsErr);
//           res.status(500).json({ error: "Error checking clients" });
//           return;
//         }

//         // If any of the clients don't exist, return an error
//         if (checkClientsResult.length < 2) {
//           res.status(404).json({ error: "One or both clients not found" });
//           return;
//         }

//         // Check if sender_appointment_id and recipient_appointment_id exist in the appointments table
//         const checkAppointmentsQuery =
//           "SELECT appointment_id FROM appointments WHERE appointment_id IN (?, ?)";
//         con.query(
//           checkAppointmentsQuery,
//           [sender_appointment_id, recipient_appointment_id],
//           (checkAppointmentsErr, checkAppointmentsResult) => {
//             if (checkAppointmentsErr) {
//               console.error(
//                 "Error checking appointments:",
//                 checkAppointmentsErr
//               );
//               res.status(500).json({ error: "Error checking appointments" });
//               return;
//             }

//             // If any of the appointments don't exist, return an error
//             if (checkAppointmentsResult.length < 2) {
//               res
//                 .status(404)
//                 .json({ error: "One or both appointments not found" });
//               return;
//             }

//             // Get the next request_id
//             const getNextIdQuery =
//               "SELECT MAX(request_id) as maxId FROM requests";
//             con.query(getNextIdQuery, (maxIdErr, maxIdResult) => {
//               if (maxIdErr) {
//                 console.error("Error getting next request ID:", maxIdErr);
//                 res
//                   .status(500)
//                   .json({ error: "Error getting next request ID" });
//                 return;
//               }

//               const nextId = maxIdResult[0].maxId + 1;

//               // Extract the recipient_client_id from the customer_appointment table
//               const getRecipientClientIdQuery =
//                 "SELECT customer_id as recipient_client_id FROM customer_appointment WHERE appointment_id = ?";
//               con.query(
//                 getRecipientClientIdQuery,
//                 [recipient_appointment_id],
//                 (recipientIdErr, recipientIdResult) => {
//                   if (recipientIdErr) {
//                     console.error(
//                       "Error getting recipient client ID:",
//                       recipientIdErr
//                     );
//                     res
//                       .status(500)
//                       .json({ error: "Error getting recipient client ID" });
//                     return;
//                   }

//                   const recipient_client_id =
//                     recipientIdResult[0].recipient_client_id;

//                   // Insert the new request in the requests table
//                   const insertQuery =
//                     "INSERT INTO requests (request_id, sender_client_id, recipient_client_id, recipient_appointment_id, sender_appointment_id) VALUES (?, ?, ?, ?, ?)";
//                   con.query(
//                     insertQuery,
//                     [
//                       nextId,
//                       sender_client_id,
//                       recipient_client_id,
//                       recipient_appointment_id,
//                       sender_appointment_id,
//                     ],
//                     (insertErr, insertResult) => {
//                       if (insertErr) {
//                         console.error("Error inserting request:", insertErr);
//                         res
//                           .status(500)
//                           .json({ error: "Error inserting request" });
//                         return;
//                       }

//                       // Request added successfully
//                       res
//                         .status(200)
//                         .json({ message: "Request added successfully" });
//                     }
//                   );
//                 }
//               );
//             });
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).json({ error: "Error processing request" });
//   }
// };
