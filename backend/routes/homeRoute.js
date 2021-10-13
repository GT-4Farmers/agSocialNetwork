const express = require("express");
const router = express.Router();
textPostsRoute = require("../controllers/getDashboardTextPostsController");
friendsRoute = require("../controllers/getCompleteFriendsListController");

router.post("/", textPostsRoute.getDashboardTextPostsController);
router.get("/friends/", friendsRoute.getCompleteFriendsListController);

module.exports = router;