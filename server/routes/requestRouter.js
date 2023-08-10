const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
//const bodyParser = require("body-parser");
const requestController = require("../controllers/requestController");

router.post("/createRequest", requestController.postCreateNewRequest);
router.get("/myRequests/:customer_id", requestController.getMyRequests);
router.get("/requestsForMe/:customer_id", requestController.getRequestsForMe);
router.delete("/deleteRequest/:request_id", requestController.deleteRequest);

module.exports = router;
