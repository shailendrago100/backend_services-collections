const Jwt               = require("jsonwebtoken");
const Config            =require("config");
const responseMessage   =require("../../resources/resources.json");
const Boom              =require("boom");
const unversalFunction  =require("../../utils/unversalFunction");
const appConstants      =require("../../utils/appConstants");
const models            =require("../../models");



const destroySession = async (token) => {
  try {
    if (token) {
      Jwt.verify(token, Config.get("jwt.secret"), async function (
        err,
        decoded
      ) {
        const criteria = {
          userId: decoded.userId,
          _id: decoded.sessionId,
        };
        let model = models.userSessionSchema;
        const session = await model.findOne(criteria);

        if (session) {
          let update = await model.findOneAndUpdate(
            criteria,
            { isDeleted: true, logoutAt: new Date() },
            { new: true }
          );
          if (!update) {
            throw Boom.unauthorized(responseMessage.SESSION_EXPIRED);
          }
        } else {
          throw Boom.unauthorized(responseMessage.INVALID_TOKEN);
        }
      });
    } else {
      return unversalFunction.sendError(
        Boom.forbidden(responseMessage.TOKEN_NOT_PROVIDED),
        res
      );
    }
  } catch (error) {
    return unversalFunction.sendError(error);
  }
};

const createToken = async (payloadData, time) => {
  
  return new Promise((resolve, reject) => {
    Jwt.sign(payloadData, Config.get("jwt.secret"), (err, jwt) => {
      if (err) {
        reject(err);
      } else {
        resolve(jwt);
      }
    });
  });
};

const sessionManager = async (sessionData) => {
  try {
    const defaults = Config.get("sessionManager");
    if (defaults) {
      let tokenExpireTime = defaults.userTokenExpireTime;
      if (sessionData.deviceType == appConstants.deviceType_website) {
        return webSessionManager(
          defaults.webMultiSession,
          tokenExpireTime,
          sessionData
        );
      } else {
        return deviceSessionManager(
          defaults.deviceMultiSession,
          tokenExpireTime,
          sessionData
        );
      }
    } else {
      throw Boom.badRequest(responseMessage.DEFAULT);
    }
  } catch (error) {
    throw error;
  }
};

const webSessionManager = async (webMultiSession, expireTime, sessionData) => {
  try {
    const tokenData = {
      userId: sessionData.userId,
      deviceType: sessionData.deviceType,
    };

    return createaccessToken(tokenData, expireTime);
  } catch (error) {
    throw error;
  }
};

const deviceSessionManager = async (
  deviceMultiSession,
  expireTime,
  sessionData
) => {
  try {
    const dataToSave = {
      userId: sessionData.userId,
      deviceType: sessionData.deviceType,
    };

    let model = models.userSessionSchema;

    if (!deviceMultiSession) {
      await model.remove({
        userId: sessionData.userId,
        deviceType: {
          $or: [appConstants.deviceType_android, appConstants.deviceType_apple],
        },
      });
    }

    const session = await model.create(dataToSave);

    const tokenData = {
      userId: sessionData.userId,
      sessionId: session._id,
      deviceType: sessionData.deviceType,
    };

    return createaccessToken(tokenData, expireTime);
  } catch (error) {
    throw error;
  }
};

const createaccessToken = async (tokenData, expireTime) => {
  try {
    const accessToken = await createToken(tokenData, expireTime);
    if (accessToken) {
      return accessToken;
    } else {
      throw Boom.badRequest(responseMessage.DEFAULT);
    }
  } catch (error) {
    throw error;
  }
};




module.exports = {
  sessionManager,
  destroySession,
  
};
