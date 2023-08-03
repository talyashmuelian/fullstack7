const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
//const bodyParser = require("body-parser");
const requestController = require("../controllers/requestController");

router.post("/createRequest", requestController.postCreateNewRequest);

module.exports = router;
