const universalFunctions                     = require("../../utils/unversalFunction")
const models                                 = require("../../models")
const appConstants                           = require("../../utils/appConstants")
const responseMessages                       = require("../../resources/resources.json");
const config                                 = require("config");
const {jwtAppTokenGenerator}                 = require("../../utils/JwtFunctions");
const Joi                                    = require("joi");
const Boom                                   = require("boom");
const {sendEmail}                            = require("../../services/MailServices/emailServicesSMTP");
const {sessionManager}                       = require("../../services/authServices/sessionmanger");
const sendnotif                              = require("../../services/pushNotification/firebaseAdmin");

exports.signinUser = async function (req, res) {
    try {
      let lang="en";
      if(req.body.lang){
        lang=req.body.lang;
      }
      const schema = Joi.object().keys({
        email: Joi.string().trim().required(),
        password: Joi.string().trim().required(),
        deviceType: Joi.string().trim().required(),
        deviceToken: Joi.string().required(),
      })
  
      console.log("payload", req.body)
      await universalFunctions.validateRequestPayload(req.body, res, schema)
      let payload = req.body
  
      let userInfo = await models.userSchema.findOne({
        email: payload.email
      })
      if (!userInfo) {
        return universalFunctions.sendError(
          {
            statusCode: 400,
            message: responseMessages.USER_NOT_FOUND,
          },
          res
        )
      } else {

        if (!userInfo.authenticate(req.body.password)) {
          throw Boom.badRequest("Authentication failed. Passwords did not match.")
        }
        let sesssionData = {
          userId: userInfo._id,
          deviceType: payload.deviceType,
        };
        let token = await sessionManager(sesssionData);
        //  console.log(token,"token:123")
        // let token =  await jwtAppTokenGenerator(userInfo._id,payload.deviceType,payload.deviceToken);  
      
        let user = {
          token:token,
          _id: userInfo._id,
          name: userInfo.name,
          email: userInfo.email,
          isPhoneVerified: userInfo.isPhoneVerified,
        }
  
        return universalFunctions.sendSuccess(
          {
            statusCode: 200,
            message: req.t("SIGNIN_SUCCESS",{lng:lang}),
            data: user,
          },
          res
        )
      }
    } catch (error) {
      return universalFunctions.sendError(error, res)
    }
  }  
  exports.signup = async function (req, res) {
    try {
      let lang="en";
      if(req.body.lang){
        lang=req.body.lang;
      }
      let payload = req.body
      console.log("payload", payload)
      let userExists = await models.userSchema.findOne({
        email: payload.email,
      })
      if (userExists) {
        return universalFunctions.sendError(
          {
            statusCode: 400,
            message: responseMessages.ALREADYEXIST,
          },
          res
        )
      } else {
        const schema = Joi.object().keys({
          name: Joi.string().trim().required(),
          lastName:Joi.string().trim().optional(),
          email: Joi.string().email().optional(),
          phoneNumber:Joi.string().optional(),
          profilePic:Joi.string().optional(),
          countryCode:Joi.string().optional(),
          password: Joi.string().required(),
          deviceType: Joi.string().trim().required(),
          deviceToken: Joi.string().required(),
          
        })
        await universalFunctions.validateRequestPayload(req.body, res, schema)

        let payload=req.body;

        let userInfo = await models.userSchema.create(payload);
        let sesssionData = {
          userId: userInfo._id,
          deviceType: payload.deviceType,
        };
        let token = await sessionManager(sesssionData);
        // console.log(token,"token:123")
        //  token =await  jwtAppTokenGenerator(userInfo._id,payload.deviceType,payload.deviceToken);  

  
        let user = {
          _id: userInfo._id,
          email: userInfo.email,
          name: userInfo.name,
          token:token,        
        }
  
        return universalFunctions.sendSuccess(
          {
            statusCode: 200,
            message: req.t("USER_CREATED_SUCCESSFULLY",{lng:lang}),
            
            data: user,
          },
          res
        )
      }
    } catch (error) {
      return universalFunctions.sendError(error, res)
    }
  }
  exports.forgotPassword = async function (req, res) {
    try {
      
        let payload={};
        let lang="en";
        if(req.body.lang){
          lang=req.body.lang;
        }
        if(req.body.usingEmail){
            payload.email=req.body.email
        }else{
            payload.phoneNumber=req.body.phoneNumber
        }
      if (!req.body.email&&!req.body.phoneNumber) {
        throw Boom.badRequest(responseMessages.EMAIL_REQUIRED)
      }
  
      let userExists = await models.userSchema.findOne(payload)
      if (!userExists) {
        throw Boom.badRequest(responseMessages.USER_NOT_FOUND)
      }
  
      const OTP = Math.floor(100000 + Math.random() * 900000)
      console.log("OTP: ", OTP, typeof OTP)
  
      let userInfo = await models.userSchema.findOneAndUpdate(
        {
          _id: userExists._id,
        },
        {
          resetPasswordOtp: OTP,
          resetPasswordExpires: Date.now() + 900000, // 15 min
        },
        {
          new: true,
        }
      )
    //   call notification service to send email  
    let emailType="FORGOT_PASSWORD";
    let dataAddEmail= {
      token:OTP
    }
    // sendEmail = (emailType, emailVariables, emailId)
    // emailVariables it shoud be object 
       await  sendEmail(emailType,dataAddEmail,req.body.email);
//       forgot passowrd using phone 
//       sendOTP(req.body.phoneNumber)
      return universalFunctions.sendSuccess(
        {
          statusCode: 200,
          message: req.t("OTP_SUCCESS",{lng:lang}),
        },
        res
      )
    } catch (error) {
      return universalFunctions.sendError(error, res)
    }
  } 
  exports.validateOTP = async function (req, res) {
    try {
      let lang="en";
      if(req.body.lang){
        lang=req.body.lang;
      }
      if (!req.body.otp) {
        throw Boom.badRequest(responseMessages.TOKEN_NOT_PROVIDED)
      }
      const schema = Joi.object().keys({
        otp: Joi.string().required(),
        email:Joi.string().optional(),
        phoneNumber:Joi.string().optional(),
        usingEmail:Joi.bool().required(),
    })
    await universalFunctions.validateRequestPayload(req.body, res, schema)
      let  payload={
        resetPasswordOtp: req.body.otp,
        resetPasswordExpires: {
          $gt: Date.now(),
        },
      }
     if(req.body.usingEmail){
       payload.email=req.body.email
     }else{
      payload.phoneNumber=req.body.phoneNumber
     }

      let userExists = await models.userSchema.findOne(payload)
      if (!userExists) {
        throw Boom.badRequest(responseMessages.INVALID_OTP)
      }  
      return universalFunctions.sendSuccess(
        {
          statusCode: 200,
          message: req.t("OTP_SUCCESS",{lng:lang}),
          data: true,
        },
        res
      )
    } catch (error) {
      return universalFunctions.sendError(error, res)
    }
  }
  
  exports.resetPassword = async function (req, res) {
    try {
      let lang="en";
      if(req.body.lang){
        lang=req.body.lang;
      }
      const schema = Joi.object().keys({
        otp: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required().valid(Joi.ref("password")),
        email:Joi.string().optional(),
        phoneNumber:Joi.string().optional(),
        usingEmail:Joi.bool().required(),
    })
    await universalFunctions.validateRequestPayload(req.body, res, schema)
    let  filter={
        resetPasswordOtp: req.body.otp,
        resetPasswordExpires: {
          $gt: Date.now(),
        },
      }
    if(req.body.usingEmail){
       filter.email=req.body.email;
    }else{
        filter.phoneNumber=req.body.phoneNumber;
    }
     
      let payload = req.body
    
      let userExists = await models.userSchema.findOne(filter);
      if (!userExists) {
        throw Boom.badRequest(responseMessages.USER_NOT_FOUND)
      }
  
      userExists.password = payload.password
      if(userExists.resetPasswordOtp){
        userExists.resetPasswordOtp="";
        userExists.resetPasswordExpires=null;
      }else{

      }
      await userExists.save()
      return universalFunctions.sendSuccess(
        {
          statusCode: 200,
          message: req.t("PASSWORD_CHANGE_SUCCESS",{lng:lang}),
          data: {},
        },
        res
      )
    } catch (error) {
      return universalFunctions.sendError(error, res)
    }
  }
  exports.changePassword = async function (req, res) {
    try {
      let lang="en";
      if(req.body.lang){
        lang=req.body.lang;
      }
      const schema = Joi.object().keys({
        currentPassword: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required().valid(Joi.ref("password")),
      })
  
      await universalFunctions.validateRequestPayload(req.body, res, schema)
      let payload = req.body
  
      let userExists = await models.userSchema.findOne({
        email: req.user.email
      })
      if (!userExists) {
        throw Boom.badRequest(responseMessages.USER_NOT_FOUND)
      }
  
      if (
        payload.currentPassword &&
        !userExists.authenticate(payload.currentPassword)
      ) {
        throw Boom.badRequest(responseMessages.INVALID_CREDENTIALS)
      }
  
      userExists.password = payload.password
      await userExists.save();
  
      return universalFunctions.sendSuccess(
        {
          statusCode: 200,
          message: req.t("PASSWORD_CHANGE_SUCCESS",{lng:lang}),
          data: {},
        },
        res
      )
    } catch (error) {
      return universalFunctions.sendError(error, res)
    }
  }