const express               = require('express');
const router                = express.Router();
const AppAuthController     = require("../../controller/authController/appAuth.controller")



router.route("/google/loginSignUp").get(AppAuthController.googleLogInSignUp);
router.route("/instagram/instagramLogInSignUp").get(AppAuthController.instagramLogInSignUp);
router.route("/facebook/facebookLogInSignUp").get(AppAuthController.facebookLogInSignUp);

module.exports = router;