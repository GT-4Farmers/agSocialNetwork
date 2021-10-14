const express = require("express");
const router = express.Router();

// imports
profileRoute = require("../controllers/profileController");
profileHeaderRoute = require("../controllers/profileHeaderController");
aboutRoute = require("../controllers/getAboutController");
friendsRoute = require("../controllers/getFriendsController");
friendsListRoute = require("../controllers/getFriendsListController");
editBioRoute = require("../controllers/editBioController");
editBirthdateRoute = require("../controllers/editBirthdateController");
editLocationRoute = require("../controllers/editLocationController");
editPhoneRoute = require("../controllers/editPhoneController");
uuidIsUserOrFriendRoute = require("../controllers/uuidIsUserOrFriendController");
friendRequestRoute = require("../controllers/friendRequestController");
incomingRequestsRoute = require("../controllers/getFriendRequestController");
createPostRoute = require("../controllers/createPostController");
getPostRoute = require("../controllers/getPostController");
deleteTextPostRoute = require("../controllers/deleteTextPostController");

// post requests
router.post("/createPost/", createPostRoute.createPostController)
router.post("/getPosts/", getPostRoute.getPostController)
router.post("/deleteTextPost/", deleteTextPostRoute.deleteTextPostController)
// info requests
router.put("/about/phone", editPhoneRoute.editPhoneController)
router.put("/about/location", editLocationRoute.editLocationController)
router.put("/about/birthdate", editBirthdateRoute.editBirthdateController)
router.put("/about/bio", editBioRoute.editBioController)
router.post("/about/", aboutRoute.getAboutController)
// friends requests
router.post("/friends/friendslist", friendsListRoute.getFriendsListController)
router.post("/friends/friendRequest", friendRequestRoute.friendRequestController)
router.get("/friends/incomingRequests", incomingRequestsRoute.getFriendRequestController)
router.post("/friends/", friendsRoute.getFriendsController)
// verification requests
router.post("/uuidIsUserOrFriend", uuidIsUserOrFriendRoute.uuidIsUserOrFriendController)
// general requests
router.get("/", profileHeaderRoute.profileHeaderController)
router.post("/", profileRoute.profileController)


module.exports = router;