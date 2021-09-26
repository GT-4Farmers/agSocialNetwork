const express = require("express");
const router = express.Router();
searchUserRoute = require("../controllers/searchUserController");

router.post("/", searchUserRoute.searchUserController);

module.exports = router;