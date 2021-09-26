const express = require("express");
const router = express.Router();
loginRoute = require("../controllers/loginController");
isLoggedInRoute = require("../controllers/isLoggedInController");

router.post("/", loginRoute.loginController);
router.get("/", isLoggedInRoute.isLoggedInController);

module.exports = router;