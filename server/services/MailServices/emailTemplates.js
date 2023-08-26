module.exports = {
  sendUserInfo: {
    subject: "Login Credentials",
    html: `<!doctype html>
        <html lang="en">
        <body style="background: #f4f4f4;font-size: 15px;line-height:20px;">
          <div>
            Hello {{{username}}}
            You can SignIn into your account using your Email: {{{email}}} & Password: {{{password}}}
          </div>
        
        </body>
        
        </html>
        `,
  },

  forgotPasswordDoc: {
    subject: "Auth_NodeJ: Forgot Password",
    html: `<!doctype html>
        <html lang="en">
        <body style="background: #f4f4f4;font-size: 15px;line-height:20px;">
        <div style="max-width:600px; margin:0 auto;background:white;font-family: Proxima-Nova-Regular,sans-serif;">
        <div style="width:100%;float:left;margin-top:10px;background: white;padding: 15px 50px;box-sizing: border-box;">
          <div style="width:100%;float:left;text-align:center;">
            <h4 style="font-size: 20px;color: #0F0F0F;text-align: center;margin-top: 0;">Hello, <span style="color:#003366;">{{{username}}}</span></h4>
            <p style="max-width: 500px;margin: 0 auto;
            font-size: 16px;
            color: #0F0F0F;
            text-align: center;
            line-height: 24px;">There was a request to reset your password!
              <br>
              <br>You can use OTP: {{{token}}} to reset your password. If you did not make this request, please ignore this email.</p>
            <br>
            <br>
          </div>
          </div>
          </div>
        
        </body>
        
        </html>
        `,
  },

  forgotPassword: {
    subject: "Auth_NodeJ: Reset Password",
    html: `
    <!doctype html>
    <html lang="en">
        <body style="background: #f4f4f4;font-size: 15px;line-height:20px;">
        <div style="max-width:600px; margin:0 auto;background:white;font-family: Proxima-Nova-Regular,sans-serif;">
        <div style="width:100%;float:left;margin-top:10px;background: white;padding: 15px 50px;box-sizing: border-box;">
          <div style="width:100%;float:left;text-align:center;">
            <h4 style="font-size: 20px;color: #0F0F0F;text-align: center;margin-top: 0;">Hello, <span style="color:#003366;">{{{username}}}</span></h4>
            <p style="max-width: 500px;margin: 0 auto;
            font-size: 16px;
            color: #0F0F0F;
            text-align: center;
            line-height: 24px;">There was a request to reset your password!
              <br>
              <br>Click on the button below to reset your password. If you did not make this request, please ignore this email.</p>
            <br> <a href="{{{link}}}"  style="background: #78FFD1;color:#003367;margin:20px auto;border-radius: 25px;text-decoration:none;font-size:12px;font-weight: bold;padding: 15px 30px;">Reset Password</a>
            <br>
            <br>
          </div>
          </div>
          </div>
        
        </body>
        
        </html>
        `,
  },

  cancelOrder: {
    subject: "Upharmai: Order Cancelled",
    html: `
    <!doctype html>
    <html lang="en">
        <body style="background: #f4f4f4;font-size: 15px;line-height:20px;">
        <div style="max-width:600px; margin:0 auto;background:white;font-family: Proxima-Nova-Regular,sans-serif;">
        <div style="width:100%;float:left;margin-top:10px;background: white;padding: 15px 50px;box-sizing: border-box;">
          <div style="width:100%;float:left;text-align:center;">
            <h4 style="font-size: 20px;color: #0F0F0F;text-align: center;margin-top: 0;">Hello,</h4>
            <p style="max-width: 500px;margin: 0 auto;
            font-size: 16px;
            color: #0F0F0F;
            text-align: center;
            line-height: 24px;">Order with Order Id: {{{orderId}}} for Amount Rs{{{amount}}} has been Cancelled by the user!
            <br>
          </div>
          </div>
          </div>
        
        </body>
        
        </html>
        `,
  },


  feedback: {
    subject: "User Feedback",
    html: `<!doctype html>
        <html lang="en">
        <body style="background: #f4f4f4;font-size: 15px;line-height:20px;">
          <div>
            Hello Operations Team,
            Feedback has been submitted by a user with details as: 
            <br>
            <br>
            First Name: <b>{{{firstName}}}</b>
            <br>
            Last Name: <b>{{{lastName}}}</b>
            <br>
            Email: <b>{{{email}}}</b>
            <br>
            Message: <b>{{{message}}}</b>
          </div>
        
        </body>
        
        </html>
        `,
  },
};
