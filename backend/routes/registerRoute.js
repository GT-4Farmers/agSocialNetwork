const express = require("express");
const router = express.Router();
registerRoute = require("../controllers/registerController");

router.post("/", registerRoute.registerController)

module.exports = router;