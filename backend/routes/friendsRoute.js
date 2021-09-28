const express = require("express");
const router = express.Router();
friendsRoute = require("../controllers/sendFriendRequestController");

router.post("/", friendsRoute.sendFriendRequestController)

module.exports = router;