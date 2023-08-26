const express          = require('express');
const router           = express.Router();
const googleController = require("../../controller/authController/google.controller")

router.route("/google/url").get(googleController.getGoogleAuthUR);
router.route("/google").get(googleController.redirectUriRoutes);

module.exports = router;