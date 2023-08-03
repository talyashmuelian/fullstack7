const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
//const bodyParser = require("body-parser");
const requestController = require("../controllers/requestController");

router.post("/createRequest", requestController.postCreateNewRequest);
// router.post("/createRequest", async (req, res) => {
//   console.log("line89");
// });

module.exports = router;
