const models                    = require("../../models")
const appConstants              = require("../../utils/appConstants")
const responseMessages          = require("../../resources/resources.json")
const  universalFunctions       = require("../../utils/unversalFunction");
const Joi                       = require("joi");
const {jwtAppTokenGenerator}    = require("../../utils/JwtFunctions");

exports.googleLogInSignUp = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            firebaseUID: Joi.string().required(),
            email:Joi.string().required(),
            firstName:Joi.string().required(),
            lastName:Joi.string().required(),
            profilePic:Joi.string().allow(""),
            deviceType: Joi.string(),
            deviceToken: Joi.string().allow(""),
          });
          let payload=req.body;
          payload.loginType=appConstants.googleConstants.googleLoginInType;
          await universalFunctions.validateRequestPayload(payload, res, schema);
          let userExist=await models.userSchema.findOne({firebaseUID:payload.firebaseUID});
          if(userExist){
           
          let token =jwtAppTokenGenerator(userExist._id,req.body.deviceType,req.body.deviceToken);
            universalFunctions.sendSuccess(
              {
                statusCode: 200,
                message: responseMessages.LOGIN_SUCCESSFULLY,
                 data: { token, userExist },

              },
              res
            );
          }else{
          let userData=await models.userSchema.create(payload);
          let token =jwtAppTokenGenerator(userData._id,req.body.deviceType,req.body.deviceToken);
          universalFunctions.sendSuccess(
            {
              statusCode: 200,
              message: responseMessages.USER_CREATED_SUCCESSFULLY,
              data: { token, userData },
            },
            res
          );
          }
    }
    catch (error)
    {
      return universalFunctions.sendError(error, res)
    }
}

exports.instagramLogInSignUp = async (req, res) => {
  try {
      const schema = Joi.object().keys({
          firebaseUID: Joi.string().required(),
          firstName:Joi.string().required(),
          lastName:Joi.string().allow(""),
          profilePic:Joi.string().allow(""),
          deviceType: Joi.string(),
          deviceToken: Joi.string().allow(""),
        });
        let payload=req.body;

          payload.loginType=appConstants.instagramConstants.instagramLogin;
          await universalFunctions.validateRequestPayload(req.body, res, schema);
          let userExist=await models.userSchema.findOne({firebaseUID:payload.firebaseUID});
          if(userExist){
          let token =jwtAppTokenGenerator(userExist._id,req.body.deviceType,req.body.deviceToken);
            universalFunctions.sendSuccess(
              {
                statusCode: 200,
                message: responseMessages.LOGIN_SUCCESSFULLY,
                 data: { token, userExist },

              },
              res
            );
          }else{
          let userData=await models.userSchema.create(payload);
          let token =jwtAppTokenGenerator(userData._id,req.body.deviceType,req.body.deviceToken);
          universalFunctions.sendSuccess(
            {
              statusCode: 200,
              message: responseMessages.USER_CREATED_SUCCESSFULLY,
              data: { token, userData },
            },
            res
          );
          }

  }
  catch (error)
  {
    return universalFunctions.sendError(error, res)
  }
}
exports.facebookLogInSignUp = async (req, res) => {
  try {
      const schema = Joi.object().keys({
          firebaseUID: Joi.string().required(),
          firstName:Joi.string().required(),
          lastName:Joi.string().allow(""),
          email:Joi.string().allow(""),
          profilePic:Joi.string().allow(""),
          deviceType: Joi.string(),
          deviceToken: Joi.string().allow("").optional(),
        });
        let payload=req.body;

          payload.loginType=appConstants.facebookConstants.facebookLogin;
          await universalFunctions.validateRequestPayload(req.body, res, schema);
          let userExist=await models.userSchema.findOne({firebaseUID:payload.firebaseUID});
          if(userExist){
          let token =jwtAppTokenGenerator(userExist._id,req.body.deviceType,req.body.deviceToken);
            universalFunctions.sendSuccess(
              {
                statusCode: 200,
                message: responseMessages.LOGIN_SUCCESSFULLY,
                 data: { token, userExist },

              },
              res
            );
          }else{
          let userData=await models.userSchema.create(payload);
          let token =jwtAppTokenGenerator(userData._id,req.body.deviceType,req.body.deviceToken);
          universalFunctions.sendSuccess(
            {
              statusCode: 200,
              message: responseMessages.USER_CREATED_SUCCESSFULLY,
              data: { token, userData },
            },
            res
          );
          }

  }
  catch (error)
  {
    return universalFunctions.sendError(error, res)
  }
}

// userData {
//   id: '113733561649532710734',
//   email: 'test.seraphic15@gmail.com',
//   verified_email: true,
//   name: 'Test Seraphic',
//   given_name: 'Test',
//   family_name: 'Seraphic',
//   picture: 'https://lh3.googleusercontent.com/a/AATXAJz3Q2PxCDZZ1f-ygxsgRyaOe3rt2WnldTd0Mv0=s96-c',
//   locale: 'en-GB',
//   iat: 1653993843
// }

// google Response