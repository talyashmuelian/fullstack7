const con = require("../config/database");
var Check = require("../models/check");

exports.postCreateNewRequest = async (req, res) => {
  const { sender_client_id, recipient_appointment_id, sender_appointment_id } =
    req.body;

  try {
    // Check if sender_client_id and recipient_client_id exist in the customer_information table
    const checkClientsQuery =
      "SELECT customer_id FROM customer_information WHERE customer_id IN (?, ?)";
    con.query(
      checkClientsQuery,
      [sender_client_id, recipient_appointment_id],
      (checkClientsErr, checkClientsResult) => {
        if (checkClientsErr) {
          console.error("Error checking clients:", checkClientsErr);
          res.status(500).json({ error: "Error checking clients" });
          return;
        }

        // If any of the clients don't exist, return an error
        if (checkClientsResult.length < 2) {
          res.status(404).json({ error: "One or both clients not found" });
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
              res.status(500).json({ error: "Error checking appointments" });
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
                        console.error("Error inserting request:", insertErr);
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
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Error processing request" });
  }
};

// exports.postCreateNewRequest = async (req, res) => {
//   const { sender_client_id, recipient_appointment_id, sender_appointment_id } =
//     req.body;
//   console.log("here");
//   // Check if sender and recipient clients exist in the customer_information table
//   const senderClientExists = await checkClientExists(sender_client_id);
//   const recipientClientExists = await checkClientExists(recipient_client_id);

//   if (!senderClientExists || !recipientClientExists) {
//     return res
//       .status(400)
//       .json({ error: "Invalid sender or recipient client ID" });
//   }

//   // Check if sender and recipient appointments exist in the appointments table
//   const senderAppointmentExists = await checkAppointmentExists(
//     sender_appointment_id
//   );
//   const recipientAppointmentExists = await checkAppointmentExists(
//     recipient_appointment_id
//   );

//   if (!senderAppointmentExists || !recipientAppointmentExists) {
//     return res
//       .status(400)
//       .json({ error: "Invalid sender or recipient appointment ID" });
//   }

//   // Get the recipient_client_id from the customer_appointment table
//   const recipient_client_id = await getRecipientClientId(
//     recipient_appointment_id
//   );

//   try {
//     // Get the next request_id by querying the requests table
//     const lastRequestId = await getLastRequestId();
//     const request_id = lastRequestId + 1;

//     // Create a new row in the requests table
//     const newRequest = {
//       request_id,
//       sender_client_id,
//       recipient_client_id,
//       recipient_appointment_id,
//       sender_appointment_id,
//     };

//     // Save the new request in the requests table
//     await con.insert("requests", newRequest);
//     //return
//     res.status(200).json({ message: "New request created successfully" });
//   } catch (err) {
//     console.error("Error creating new request:", err);
//     return res.status(500).json({ error: "Failed to create new request" });
//   }
// };

// // Helper function to check if a client exists in the customer_information table
// async function checkClientExists(client_id) {
//   try {
//     const client = await con.select("customer_information", {
//       customer_id: client_id,
//     });
//     return client.length > 0;
//   } catch (err) {
//     console.error("Error checking client existence:", err);
//     return false;
//   }
// }

// // Helper function to check if an appointment exists in the appointments table
// async function checkAppointmentExists(appointment_id) {
//   try {
//     const appointment = await con.select("appointments", { appointment_id });
//     return appointment.length > 0;
//   } catch (err) {
//     console.error("Error checking appointment existence:", err);
//     return false;
//   }
// }

// // Helper function to get the recipient_client_id from the customer_appointment table
// async function getRecipientClientId(appointment_id) {
//   try {
//     const customerAppointment = await con.select("customer_appointment", {
//       appointment_id,
//     });
//     return customerAppointment[0].customer_id;
//   } catch (err) {
//     console.error("Error getting recipient client ID:", err);
//     return null;
//   }
// }

// // Helper function to get the last request_id from the requests table
// async function getLastRequestId() {
//   try {
//     const lastRequest = await con.select(
//       "requests",
//       {},
//       { order: { by: "request_id", descending: true }, limit: 1 }
//     );
//     return lastRequest.length > 0 ? lastRequest[0].request_id : 0;
//   } catch (err) {
//     console.error("Error getting last request ID:", err);
//     return 0;
//   }
// }

// exports.postCreateNewRequest = async (req, res) => {
//   const {
//     sender_client_id,
//     recipient_client_id,
//     recipient_appointment_id,
//     sender_appointment_id,
//   } = req.body;

//   // Check if the sender_client_id and recipient_client_id exist in the customer_information table
//   const customerCheckQuery = `
//         SELECT COUNT(*) as count FROM customer_information
//         WHERE customer_id IN (${sender_client_id}, ${recipient_client_id});
//     `;
//   const customerCheckResult = await con.query(customerCheckQuery);

//   if (customerCheckResult[0].count !== 2) {
//     return res
//       .status(400)
//       .json({ error: "One or both customer IDs do not exist." });
//   }

//   // Check if the recipient_appointment_id and sender_appointment_id exist in the appointments table
//   const appointmentCheckQuery = `
//         SELECT COUNT(*) as count FROM appointments
//         WHERE appointment_id IN (${recipient_appointment_id}, ${sender_appointment_id});
//     `;
//   const appointmentCheckResult = await con.query(appointmentCheckQuery);

//   if (appointmentCheckResult[0].count !== 2) {
//     return res
//       .status(400)
//       .json({ error: "One or both appointment IDs do not exist." });
//   }

//   // Get the last request_id from the requests table
//   const lastRequestIdQuery =
//     "SELECT MAX(request_id) as max_request_id FROM requests;";
//   const lastRequestIdResult = await con.query(lastRequestIdQuery);
//   const lastRequestId = lastRequestIdResult[0].max_request_id || 0;

//   // Generate the new request_id by incrementing the last request_id
//   const newRequestId = lastRequestId + 1;

//   // Insert the new row into the requests table
//   const insertQuery = `
//         INSERT INTO requests (request_id, sender_client_id, recipient_client_id, recipient_appointment_id, sender_appointment_id)
//         VALUES (${newRequestId}, ${sender_client_id}, ${recipient_client_id}, ${recipient_appointment_id}, ${sender_appointment_id});
//     `;
//   await con.query(insertQuery);

//   // Return success response
//   return res.status(201).json({ message: "New request created successfully." });
// };
