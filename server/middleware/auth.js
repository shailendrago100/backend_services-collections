const models                    = require("../models")
const responseMessages          = require("../resources/resources.json")
const  universalFunctions       = require("../utils/unversalFunction");
const Joi                       = require("joi");
const {jwtAppTokenGenerator}    = require("../utils/JwtFunctions");
const  Boom                     =require("boom")
const  Config                   =require("config")

const checkAuth =  async(req, res, next) => {

  const token = req.headers["x-access-token"] || req.query["x-access-token"] || req.headers["token"];

  if (token) {
      Jwt.verify(token, Config.get("jwt.secret"), async function (err, decoded) {
        try {
          console.log("decoded inside",decoded);

            let model = models.userSchema

            let user = await model.findOne({ _id: decoded.userId });

            if (!user) {
              throw Boom.unauthorized(responseMessages.USER_NOT_FOUND);
            }
            user = user.toJSON();

            // if (user.isDeleted) {
            //   throw Boom.badRequest(responseMessages.USER_NOT_FOUND);
            // }
            // if (user.userSuspend) {
            //   throw Boom.badRequest(responseMessages.userSuspend);
            // }
            
       
              let userInfo = {
                id: user._id,
                name: user.name,
                email: user.email ? user.email : "",
                phoneNumber: user.phoneNumber ? user.phoneNumber : "",
              };
              req.user = userInfo;
              next();

        } catch (error) {
          return universalFunctions.sendError(error, res);
        }

       })
      
    } else {
      return universalFunctions.sendError(
        Boom.forbidden(responseMessages.TOKEN_NOT_PROVIDED),
        res
      );
    }
};

module.exports = {
    checkAuth,
}