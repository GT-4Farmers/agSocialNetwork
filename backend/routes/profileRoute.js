const express = require("express");
const router = express.Router();
profileRoute = require("../controllers/profileController");
aboutRoute = require("../controllers/getAboutController");
editBioRoute = require("../controllers/editBioController");
editBirthdateRoute = require("../controllers/editBirthdateController");
editLocationRoute = require("../controllers/editLocationController");
editPhoneRoute = require("../controllers/editPhoneController");

router.put("/about/phone", editPhoneRoute.editPhoneController)
router.put("/about/location", editLocationRoute.editLocationController)
router.put("/about/birthdate", editBirthdateRoute.editBirthdateController)
router.put("/about/bio", editBioRoute.editBioController)
router.get("/about/", aboutRoute.getAboutController)
router.get("/", profileRoute.profileController)

module.exports = router;