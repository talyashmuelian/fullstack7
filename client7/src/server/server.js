const express = require("express");
const customerRouter = require("./routes/customerRouter");

const app = express();

// Use the router for the '/customers' route
app.use("/signInCustomers", customerRouter);
app.use("/logInCustomers", customerRouter);

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
