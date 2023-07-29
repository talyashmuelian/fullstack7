const customerRouter = require("./routes/customerRouter");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());
// Use the router for the '/customers' route
//app.use("/signInCustomers", customerRouter);
app.use("/customers", customerRouter);

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
