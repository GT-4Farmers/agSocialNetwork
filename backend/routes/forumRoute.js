const express = require("express");
const router = express.Router();
tagRoute = require("../controllers/getTagsController");
createDiscussionRoute = require("../controllers/createDiscussionController");

router.post("/getTags", tagRoute.getTagsController);
router.post("/createDiscussion", createDiscussionRoute.createDiscussionController);

module.exports = router;