const express = require("express");
const router = express.Router();
profileRoute = require("../controllers/profileController");
profileHeaderRoute = require("../controllers/profileHeaderController");
aboutRoute = require("../controllers/getAboutController");
friendsRoute = require("../controllers/getFriendsController");
editBioRoute = require("../controllers/editBioController");
editBirthdateRoute = require("../controllers/editBirthdateController");
editLocationRoute = require("../controllers/editLocationController");
editPhoneRoute = require("../controllers/editPhoneController");

router.put("/about/phone", editPhoneRoute.editPhoneController)
router.put("/about/location", editLocationRoute.editLocationController)
router.put("/about/birthdate", editBirthdateRoute.editBirthdateController)
router.put("/about/bio", editBioRoute.editBioController)
router.post("/about/", aboutRoute.getAboutController)
router.post("/friends/", friendsRoute.getFriendsController)
router.get("/", profileHeaderRoute.profileHeaderController)
router.post("/", profileRoute.profileController)

module.exports = router;