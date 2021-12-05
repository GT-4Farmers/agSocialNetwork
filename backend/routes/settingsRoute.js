const express = require("express");
const router = express.Router();
credentialsRoute = require("../controllers/updateCredentialsController");
privacyRoute = require("../controllers/updatePrivacyController");
getPrivacyRoute = require("../controllers/getPrivacyController");

router.post("/updateCredentials", credentialsRoute.updateCredentialsController);
router.post("/updatePrivacy", privacyRoute.updatePrivacyController);
router.get("/getPrivacy", getPrivacyRoute.getPrivacyController);

module.exports = router;