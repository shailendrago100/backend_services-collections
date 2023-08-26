const express               = require('express');
const router                = express.Router();
const admin                = require("../../controller/admin.controllers.js/admin");




router.route("/addEmailTemplate").post(admin.addEmailTemplate);


module.exports = router;