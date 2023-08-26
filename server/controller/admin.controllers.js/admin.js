
const models                       =require("../../models/index")
const appConstants                 =require("../../utils/appConstants")
const responseMessages             =require("../../resources/resources.json")
const  universalFunctions          =require("../../utils/unversalFunction");
const Joi                          =require("joi");

exports.addEmailTemplate =async (req, res) => {
    try{
        const schema = Joi.object().keys({
            htmlBody: Joi.string().required(),
            subject:Joi.string().required(),
            type:Joi.string().required(),
        
          });
          let payload=req.body;
          await universalFunctions.validateRequestPayload(payload, res, schema);
          let emailtemp=await models.emailTemplateSchema.create(payload);
          universalFunctions.sendSuccess(
            {
              statusCode: 200,
              message: universalFunctions.translateResponse("create email"),
              data: { emailtemp },
            },
            res
          );
    }catch(error){
        console.log(error,"error")
        return universalFunctions.sendError(error, res)
    }
   
    }
