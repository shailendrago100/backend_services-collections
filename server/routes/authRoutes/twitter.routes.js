const express           = require('express');
const router            = express.Router();
const twitterController = require("../../controller/authController/twitter.controller")

router.route("/authenticate").get(twitterController.authenticate);
router.route("/authorize").get(twitterController.twitter("authorize"));
router.route("/twitterCallback").get(twitterController.twitterCallback);

module.exports = router;