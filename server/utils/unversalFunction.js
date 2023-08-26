const Boom                     = require("boom");
const Joi                      = require("@hapi/joi");
const responseMessages         = require("../resources/resources.json")
const  { JsonWebTokenError }   = require("jsonwebtoken");
const translate                = require('translate-google')

const validateRequestPayload = async (requestObj, res, schema) => {
  return new Promise((resolve, reject) => {
    const { error } = schema.validate(requestObj);
    if (error) {
      let message = sendBadRequestError(error, res);
      reject(Boom.badRequest(message));
    } else {
      resolve();
    }
  });
};

const sendOauthError = (err, res) => {
  console.log("ERROR OCCURRED IN SEND Oauth ERROR FUNCTION", err);
  if (err instanceof JsonWebTokenError) {
    res
      .status(401)
      .json({
        error: "invalid_token",
        error_description: responseMessages.INVALID_TOKEN,
      });
  }
  res.status(err.statusCode).json(err.prepareResponse());
};

const sendError =async (data, res) => {
  let error;
  console.log("ERROR OCCURRED IN SEND ERROR FUNCTION", data);
  let message = null;
  if (typeof data == "object" && !data.isBoom) {
    if (data.name == "MongoError") {
      // Check Mongo Error
      message = responseMessages.DB_ERROR;
      if (data.code == 11000) {
        if (data.message.split(" ").indexOf("email_1") > -1) {
          const conflictError = Boom.conflict(
            responseMessages.EMAIL_ALREADY_EXISTS
          );
          conflictError.output.payload.data = {}
          return res.json(conflictError.output.payload);
        } else {
          message = responseMessages.DUPLICATE;
        }
      }
    } else if (data.name == "ApplicationError") {
      message = responseMessages.APP_ERROR;
    } else if (data.name == "ValidationError") {
      message = responseMessages.APP_ERROR;
    } else if (data.name == "CastError") {
      message = responseMessages.INVALID_OBJECT_ID;
    } else if (data.response) {
      message = data.response.message;
    } else if (data.message) {
      message = data.message;
    } else {
      message = responseMessages.DEFAULT;
    }
    if (message !== null) {
      error = new Boom(message, {
        statusCode: 400,
        data: {}
      });
      return res.json(error.output.payload);
    }
  } else if (typeof data == "object" && data.isBoom) {
    if (data.data && data.data.code) {
      data.output.payload.code = data.data.code;
    }
    data.output.payload.data = {}
    return res.json(data.output.payload);
  } else {
    error = new Boom(data, {
      statusCode: 400,
      data: {}
    });
    return res.json(error.output.payload);
  }
};

/*-------------------------------------------------------------------------------
 * send success
 * -----------------------------------------------------------------------------*/

const sendSuccess =async (response, res) => {
  const statusCode =
    response && response.statusCode ? response.statusCode : 200;
  let message = response && response.message ? response.message : "Success";
  const data = response.data ? response.data : {};
  if (data.password) {
    delete data.password;
  }
  return res.json({
    statusCode,
    message,
    data,
    error: ""
  });
};

/*-------------------------------------------------------------------------------
 * Joi error handle
 * -----------------------------------------------------------------------------*/
const sendBadRequestError = (error, res) => {
  let message = error.details[0].message;
  message = message.replace(/"/g, "");
  message = message.replace("[", "");
  message = message.replace("]", "");

  return message;
};
const translateResponse = async (text)=>{
  
  translate(text, {to: 'hi'}).then(res => {
      return res;
  }).catch(err => {
      return "lll";
  })
  
}
// const hello =async ()=>{
//   let temp=[]
//   response.respoArry.map(e=>{
//   console.log(e);
//   temp.push(e)
//   })
// }
// hello()
module.exports = {
  validateRequestPayload,
  sendSuccess,
  sendError,
  sendOauthError,
  translateResponse
};
