const con = require("../config/database");

exports.signinCustomer = async (req, res) => {
  const { username, password } = req.body;
  console.log("line5");
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
        console.log("line18");
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
            console.log("line34");
            con.query(insertQuery, values, (insertErr, insertResult) => {
              if (insertErr) {
                console.log("Error inserting customer:", insertErr);
                res.status(500).json({ error: "Error inserting customer" });
              } else {
                res.status(201).json({
                  message: "Customer created successfully!",
                  customer_id: nextCustomerId,
                  username,
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
        res.status(200).json({ message: "Login successful" });
        //res.send("hi");
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
