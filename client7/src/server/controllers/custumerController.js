const con = require("../config/database");
var Check = require("../models/check");

exports.signinCustomer = (req, res) => {
  const { username, password, name, id_number, phone, email } = req.body;
  const { error } = Check.check("customer", req.body);
  //   const { error } = Check.check("identification_customers", req.body);
  //   const { error1 } = Check.check("customer_information", req.body);
  if (error) {
    console.log("line9");
    console.log(error.details[0].message);
    res.status(400).send(error.details[0].message);
    return;
  }
  // Check if the username already exists in the database
  const usernameQuery =
    "SELECT COUNT(*) as count FROM identification_customers WHERE username = ?";
  con.query(usernameQuery, [username], (usernameErr, usernameResult) => {
    if (usernameErr) {
      console.error("Error checking username:", usernameErr);
      res.status(500).json({ error: "Error checking username" });
    } else {
      const usernameCount = usernameResult[0].count;

      if (usernameCount > 0) {
        res.status(408).json({ error: "Username already exists" });
      } else {
        // Get the maximum customer_id from the database and increment it by 1
        const getMaxIdQuery =
          "SELECT MAX(customer_id) as max_id FROM identification_customers";
        con.query(getMaxIdQuery, (err, result) => {
          if (err) {
            console.error("Error fetching max customer_id:", err);
            res.status(500).json({ error: "Error fetching max customer_id" });
          } else {
            const nextCustomerId = result[0].max_id + 1;

            // Insert the new customer into the database with the nextCustomerId
            const insertQuery =
              "INSERT INTO identification_customers (customer_id, username, password) VALUES (?, ?, ?)";
            const values = [nextCustomerId, username, password];
            con.query(insertQuery, values, (insertErr, insertResult) => {
              if (insertErr) {
                console.log("Error inserting customer:", insertErr);
                res.status(500).json({ error: "Error inserting customer" });
              } else {
                const insertQuery1 =
                  "INSERT INTO customer_information (customer_id, name, id_number,phone,email) VALUES (?, ?, ?,?,?)";
                const values1 = [nextCustomerId, name, id_number, phone, email];
                con.query(insertQuery1, values1, (insertErr1, insertResult) => {
                  if (insertErr1) {
                    console.log("Error inserting customer:", insertErr1);
                    res.status(500).json({ error: "Error inserting customer" });
                  } else {
                    res.status(200).json({
                      message: "Customer created successfully!",
                      customer_id: nextCustomerId,
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
  });
};

// postsRouter.js (Assuming you already have the required imports and database configuration)

exports.loginCustomer = async (req, res) => {
  console.log("hi");
  const { username, password } = req.query;

  // Check if the username and password exist together in the database
  const loginQuery =
    "SELECT * FROM identification_customers WHERE username = ?";
  con.query(loginQuery, [username], async (loginErr, loginResult) => {
    if (loginErr) {
      console.error("Error checking login credentials:", loginErr);

      res.status(500).json({ error: "Error checking login credentials" });
      res.send();
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
        // res.status(200).json({ message: "Login successful", });
        res.status(200).json({ id: loginResult[0].customer_id });
        res.send();
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

exports.getCustomerInfo = async (req, res) => {
  const id = req.params.id;

  // Check if the 'id' parameter is provided
  if (!id) {
    res.status(400).json({ error: "Missing customer ID parameter" });
    return;
  }

  try {
    // Get customer information from the database
    const query =
      "SELECT * FROM identification_customers WHERE customer_id = ?";
    pool.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error fetching customer info:", err);
        res.status(500).json({ error: "Error fetching customer info" });
        return;
      }

      // If no customer with the given ID is found, return an error
      if (result.length === 0) {
        res.status(404).json({ error: "Customer not found" });
        return;
      }

      // Customer found, send the customer info in the response
      res.status(200).json({ customer: result[0] });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Error processing request" });
  }
};
