const oauth           = require('oauth');
const { promisify }   = require('util');
const config          =require("config");


const twitterKey =config.get("twitterKey");
const TWITTER_CONSUMER_API_KEY =twitterKey.Twitter_API_Key;
const TWITTER_CONSUMER_API_SECRET_KEY = twitterKey.Twitter_API_SECRET;
const callBack_URL=twitterKey.callBack_URL;

const oauthConsumer = new oauth.OAuth(
  'https://twitter.com/oauth/request_token',
  'https://twitter.com/oauth/access_token',
  TWITTER_CONSUMER_API_KEY,
  TWITTER_CONSUMER_API_SECRET_KEY,
  '1.0A'
  , callBack_URL,  // use config for get twitter callback url 
   'HMAC-SHA1')

module.exports = {
  oauthGetUserById,
  getOAuthAccessTokenWith,
  getOAuthRequestToken
}

async function oauthGetUserById (userId, { oauthAccessToken, oauthAccessTokenSecret } = {}) {

  return promisify(oauthConsumer.get.bind(oauthConsumer))(`https://api.twitter.com/1.1/users/show.json?user_id=${userId}`, oauthAccessToken, oauthAccessTokenSecret)
    .then(body => { 
        console.log(body,"body");
        return JSON.parse(body)
    }).catch((err)=>{
        console.log(err,"errr inside oauthgetUserById");
    })
}
async function getOAuthAccessTokenWith ({ oauthRequestToken, oauthRequestTokenSecret, oauthVerifier } = {}) {
  return new Promise((resolve, reject) => {
    oauthConsumer.getOAuthAccessToken(oauthRequestToken, oauthRequestTokenSecret, oauthVerifier, function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
      return error!=null
        ? reject(error)
        : resolve({ oauthAccessToken, oauthAccessTokenSecret, results })
    })
  })
}
async function getOAuthRequestToken () {
  return new Promise(async(resolve, reject) => {
    oauthConsumer.getOAuthRequestToken(function (error, oauthRequestToken, oauthRequestTokenSecret, results) {
        console.log(error, oauthRequestToken, oauthRequestTokenSecret, results,"sssd");
        if(error){
            reject(error);
        }else{
            resolve({ oauthRequestToken, oauthRequestTokenSecret, results });
        }
   
    })
  })
}