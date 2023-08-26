const express      = require('express');
const router       = express.Router();
const firebaseAuth = require("../../controller/authController/firebaseAuth.controller")


router.route("/loginSignUp").get(firebaseAuth.firebaseLoginSignUp);


module.exports = router;