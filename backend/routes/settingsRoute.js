const express = require("express");
const router = express.Router();
credentialsRoute = require("../controllers/updateCredentialsController");

router.post("/updateCredentials", credentialsRoute.updateCredentialsController);

module.exports = router;