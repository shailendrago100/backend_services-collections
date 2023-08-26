const Config                  = require("config")
const Templates               = require("./emailTemplates")
const Handlebars              =require("handlebars")
let nodemailer                =require("nodemailer");
let universalFunctions        =require("./../../utils/unversalFunction")
let models                    =require("./../../models") 
// let mailchimp                =require("./mailchimp")
// let SendGrid                =require("./sendGrid")

const nodeMailerConfig=Config.get("nodeMailer_SMTP");

const renderMessageFromTemplateAndVariables = (templateData, variablesData) => {
  return Handlebars.compile(templateData)(variablesData);
};


exports.sendEmail =async (emailType, emailVariables, emailId) => {
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: nodeMailerConfig.user,
            pass: nodeMailerConfig.pass,
        }
    })
  var mailOptions = {
    from: nodeMailerConfig.user,
    to: emailId,
    subject: null,
    html: null,
  };

 const emailTemp=await  models.emailTemplateSchema.findOne({type:emailType})
 if(!emailTemp){
  return universalFunctions.sendError("emailTemplate is found add on db first/check email type ", res)
 }
  //console.log(emailTemp,emailType,"nj")

      mailOptions.subject = emailTemp.subject;
      mailOptions.html = renderMessageFromTemplateAndVariables(
        emailTemp.htmlBody,
        emailVariables
      );


  transporter.sendMail(mailOptions, function (error, info) {
    if (!error) {
      console.log(`Email sent!`, info);

    } else {
      throw error
    }
  })
};
