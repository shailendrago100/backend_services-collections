// let nodemailer                =require("nodemailer")
// let config                    =require("config")


// const nodeMailerConfig=config.get("nodeMailer");

// const sendOTPUsingEmail =async (email,otp) => {
//   try {
//     var transporter = nodemailer.createTransport(nodeMailerConfig);
//     let bodymessage = `your otp  ${otp}`
//     var mailOptions = {
//       from: `test.seraphic15@gmail.com`,
//       to: `${email}`,
//       subject: `Thank you for contacting Infinite`,
//       html: `${bodymessage}`,
//     }
//      transporter.sendMail(mailOptions, function (error, info) {
//       if (!error) {
//         console.log(`Email sent!`, info);

//       } else {
//         throw error
//       }
//     })
//   } catch (err) {
//     throw err
//   }
// }
// exports.sendOTPUsingEmail=sendOTPUsingEmail;

// // {
// //   host: "smtp.gmail.com",
// //   port: 465,
// //   secure: true,
// //   auth: {
// //     type: "OAuth2",
// //     user: "test.seraphic15@gmail.com",
// //     clientId: "770958484593-tk52pmiqbca58hpuc6sjgpdtnhn6hjcn.apps.googleusercontent.com",
// //     clientSecret: "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",
// //     accessToken:"ya29.a0ARrdaM8B3Fv76tHtXXb0p9iG6FUzi05S6fjZ8zkCtLZVClUq1Y3Sx6ser4XiR7rFVLdgqkmbIgczX_O_TH53Ty1V6zZIsgrW6w2zs6wchDeEoPFYY-eJb63fi7gWoUOT4iZOYU7hXDNqfMhHiT2XekFek7Gx",
// //     refreshToken:"1//04F9xz3DF9Ak_CgYIARAAGAQSNgF-L9IrjBCieto8unikEBJtt8mFYd_LdIUxdxFm_DHHUzO2En50gsJGFUN8WOc7-snRWIIngw"
// //   }
// // }
// // {
// //   "access_token": "ya29.a0ARrdaM8B3Fv76tHtXXb0p9iG6FUzi05S6fjZ8zkCtLZVClUq1Y3Sx6ser4XiR7rFVLdgqkmbIgczX_O_TH53Ty1V6zZIsgrW6w2zs6wchDeEoPFYY-eJb63fi7gWoUOT4iZOYU7hXDNqfMhHiT2XekFek7Gx", 
// //   "scope": "https://mail.google.com/ https://www.googleapis.com/auth/adwords", 
// //   "token_type": "Bearer", 
// //   "expires_in": 3599, 
// //   "refresh_token": "1//04F9xz3DF9Ak_CgYIARAAGAQSNgF-L9IrjBCieto8unikEBJtt8mFYd_LdIUxdxFm_DHHUzO2En50gsJGFUN8WOc7-snRWIIngw"
// // }

