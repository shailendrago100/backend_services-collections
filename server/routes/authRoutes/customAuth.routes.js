const express                    = require('express');
const router                     = express.Router();
const customAuth                 = require("../../controller/authController/customAuth.controller")

router.post('/user/signin', customAuth.signinUser);
router.post('/user/signup', customAuth.signup);
router.post('/user/forgotPassword', customAuth.forgotPassword);
router.post('/user/validateOTP', customAuth.validateOTP);
router.post('/user/resetPassword', customAuth.resetPassword);


module.exports = router;