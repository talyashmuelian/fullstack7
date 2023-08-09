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

exports.createAppointments = async (req, res) => {
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

exports.AdminFutureAppointments = async (req, res) => {
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
