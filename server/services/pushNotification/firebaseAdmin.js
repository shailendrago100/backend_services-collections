var admin                       = require("firebase-admin");
const models                    = require("../../models")
const appConstants              = require("../../utils/appConstants")
const responseMessages          = require("../../resources/resources.json")
const  universalFunctions       = require("../../utils/unversalFunction");
const Joi                       = require("joi");
const Boom                      = require("boom");
const config                    = require("config");


var serviceAccount = config.get("firebaseAdminSDK");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:"firebase-adminsdk-rf954@borhan-33e53.iam.gserviceaccount.com"
});


exports.sendPushNotifications=async (deviceToken,payload)=>{
      
     let options = { priority: "high" };
     
     await admin
        .messaging()
        .sendToDevice(deviceToken, payload, options)
        .then(function (response) {
          if (response.results[0].error) {
            console.log(response.results[0].error);
          }
          console.log("notification response", response);
        })
        .catch(function (error) {
            console.log(error);
        });
} 

exports.AdminPushNotifications = async function (req, res) {
    try {
        const schema = Joi.object().keys({
            title: Joi.string().required(),
            message:Joi.string().required(),
            filter:Joi.object().required(),
          });
    
          await universalFunctions.validateRequestPayload(payload, res, schema);        

      let title = req.body.title.trim();
      let message = req.body.message.trim();
      let payload=req.body.filter
 
      let userForNotification = await models.userSchema.find(payload);

      userForNotification = userForNotification
        ? JSON.parse(JSON.stringify(userForNotification))
        : [];
      let userArray = [];

  
      userForNotification.map((user) => {
        if (user && user.deviceDetails) {
          user && user.deviceDetails.map((e) => {
              if(e.deviceToken){
              userArray.push(e);
              }
            });
        }
      });

      if (userArray.length == 0) {
        res.send({ success: false, data: "No Token Found" });
        // throw Boom.badRequest(responseMessages.TOKEN_NOT_PROVIDED)
      } else {
        userArray.map(async (deviceDetails) => {

        let deviceToken = deviceDetails.deviceToken;
        let deviceType=deviceDetails.deviceType?deviceDetails.deviceType:1
        let payload = {
            deviceToken : token,
            notification: {
              type:"accept",
              title: title,
              body: message,
              badge: "0",
            },
          };
          let options = { priority: "high" };
         
          await admin
            .messaging()
            .sendToDevice([deviceToken], payload, options)
            .then(function (response) {
              if (response.results[0].error) {
                console.log(response.results[0].error);
              }
              console.log("notification response", response);
            })
            .catch(function (error) {
                console.log(error);
            });
         
        });
        universalFunctions.sendSuccess(
            {
              statusCode: 200,
              message: responseMessages.SUCCESS,
              data: {},
            },
            res
          );
      }
    } catch (error) {
      console.log("error sending msg", error);
      return universalFunctions.sendError(error, res)
    }
  };