const express = require("express");
const router = express.Router();
logoutRoute = require("../controllers/logoutController");

router.post("/", logoutRoute.logoutController)

module.exports = router;