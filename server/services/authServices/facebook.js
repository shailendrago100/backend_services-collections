const axios             = require("axios");
const config            =require("config");



const facebookKey       =config.get("facebookKey");
const appId             =facebookKey.appId;
const appSecret         = facebookKey.appSecret;
const SERVER_ROOT_URI   = config.get("SERVER_ROOT_URI"); //+/auth/facebook/oauth-redirect

function generateAccessToken(authCode) {
      try {
    const accessTokenUrl = 'https://graph.facebook.com/v6.0/oauth/access_token?' +
      `client_id=${appId}&` +
      `client_secret=${appSecret}&` +
      `redirect_uri=${encodeURIComponent(`${SERVER_ROOT_URI}/auth/facebook/oauth-redirect`)}&` +
      `code=${encodeURIComponent(authCode)}`;
      return accessTokenUrl;
    } catch (error) {
      
      console.log(error);
     throw error
    }
}
exports.generateAccessToken=generateAccessToken;

