const express = require("express");
const router = express.Router();
tagRoute = require("../controllers/getTagsController");
createDiscussionRoute = require("../controllers/createDiscussionController");
getDiscussionsRoute = require("../controllers/getDiscussionsController");
getDiscussionPageRoute = require("../controllers/getDiscussionPageController");
getNamesRoute = require("../controllers/getNamesController");
// createCommentRoute = require("../controllers/createForumCommentController");
createPostRoute = require("../controllers/createTextPostController");
updateLikeCountRoute = require("../controllers/updateLikeCountForumsController");

router.post("/getTags", tagRoute.getTagsController);
router.post("/createDiscussion", createDiscussionRoute.createDiscussionController);
router.post("/getDiscussions", getDiscussionsRoute.getDiscussionsController);
router.post("/getDiscussionPage", getDiscussionPageRoute.getDiscussionPageController);
router.post("/getNames", getNamesRoute.getNamesController);
// router.post("/createComment", createCommentRoute.createForumCommentController);
router.post("/createPost", createPostRoute.createTextPostController);
router.post("/updateLikeCount", updateLikeCountRoute.updateLikeCountForumsController);

module.exports = router;