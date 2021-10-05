const express = require("express");
const router = express.Router();
profileRoute = require("../controllers/profileController");
profileHeaderRoute = require("../controllers/profileHeaderController");
aboutRoute = require("../controllers/getAboutController");
friendsRoute = require("../controllers/getFriendsController");
friendsListRoute = require("../controllers/getFriendsListController");
editBioRoute = require("../controllers/editBioController");
editBirthdateRoute = require("../controllers/editBirthdateController");
editLocationRoute = require("../controllers/editLocationController");
editPhoneRoute = require("../controllers/editPhoneController");
uuidIsUserOrFriendRoute = require("../controllers/uuidIsUserOrFriendController")
friendRequestRoute = require("../controllers/friendRequestController")

router.put("/about/phone", editPhoneRoute.editPhoneController)
router.put("/about/location", editLocationRoute.editLocationController)
router.put("/about/birthdate", editBirthdateRoute.editBirthdateController)
router.put("/about/bio", editBioRoute.editBioController)
router.post("/about/", aboutRoute.getAboutController)
router.post("/friends/friendslist", friendsListRoute.getFriendsListController)
router.post("/friends/", friendsRoute.getFriendsController)
router.post("/uuidIsUserOrFriend", uuidIsUserOrFriendRoute.uuidIsUserOrFriendController)
router.post("/friends/friendRequest", friendRequestRoute.friendRequestController)
router.get("/", profileHeaderRoute.profileHeaderController)
router.post("/", profileRoute.profileController)

module.exports = router;