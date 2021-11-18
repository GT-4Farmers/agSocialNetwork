const express = require("express");
const router = express.Router();
tagRoute = require("../controllers/getTagsController");
createDiscussionRoute = require("../controllers/createDiscussionController");
getDiscussionsRoute = require("../controllers/getDiscussionsController");

router.post("/getTags", tagRoute.getTagsController);
router.post("/createDiscussion", createDiscussionRoute.createDiscussionController);
router.post("/getDiscussions", getDiscussionsRoute.getDiscussionsController);

module.exports = router;