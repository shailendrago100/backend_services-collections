const express             = require('express');
const router              = express.Router();
const instagramController = require("../../controller/authController/instagram.controller")



router.route("/instagram/url").get(instagramController.getInstagramAuthURL);
router.route("/instagram").get(instagramController.redirectUriRoutes);


module.exports = router;