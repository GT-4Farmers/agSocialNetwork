const express = require("express");
const router = express.Router();
textPostsRoute = require("../controllers/getDashboardTextPostsController");
friendsRoute = require("../controllers/getCompleteFriendsListController");
likesRoute = require("../controllers/likesController");
getLikesRoute = require("../controllers/getLikesController");
updateLikesRoute = require("../controllers/updateLikeCountController");
createCommentRoute = require("../controllers/createCommentController");

router.post("/updateLikeCount/", updateLikesRoute.updateLikeCountController);
router.post("/likes/getLikes/", getLikesRoute.getLikesController);
router.post("/likes/", likesRoute.likesController);
router.get("/friends/", friendsRoute.getCompleteFriendsListController);
router.post("/createComment", createCommentRoute.createCommentController);
router.post("/", textPostsRoute.getDashboardTextPostsController);

module.exports = router;