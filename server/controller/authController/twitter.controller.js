
const {
  getOAuthRequestToken,
  getOAuthAccessTokenWith,
  oauthGetUserById
} = require('../../services/authServices/twitter');


const fs = require('fs');

var twitter_access_Token=[];

  exports.twitter = (method = 'authorize')=> {
    return async (request, reply) => {

      const { oauthRequestToken, oauthRequestTokenSecret } = await getOAuthRequestToken()
      console.log(oauthRequestToken,"oauthRequestToken")
      request.session = request.session || {}
      request.session.oauthRequestToken = oauthRequestToken
      request.session.oauthRequestTokenSecret = oauthRequestTokenSecret
      twitter_access_Token.push({oauthRequestToken:oauthRequestToken,oauthRequestTokenSecret:oauthRequestTokenSecret});
      const authorizationUrl = `https://api.twitter.com/oauth/${method}?oauth_token=${oauthRequestToken}`
        reply.redirect(authorizationUrl)
    }
  }
  exports.authenticate= async (request, reply) => {
   
      // console.log(`/twitter/${method}`)
      const { oauthRequestToken, oauthRequestTokenSecret } = await getOAuthRequestToken()
      console.log(oauthRequestToken,"oauthRequestToken")
      request.session = request.session || {}
      request.session.oauthRequestToken = oauthRequestToken
      request.session.oauthRequestTokenSecret = oauthRequestTokenSecret
      twitter_access_Token.push({oauthRequestToken:oauthRequestToken,oauthRequestTokenSecret:oauthRequestTokenSecret});
      const authorizationUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthRequestToken}`

        reply.redirect(authorizationUrl)
  }

    exports.twitterCallback = async (request, reply) => {
      try{
      let oauthRequestToken, oauthRequestTokenSecret;
    const { oauth_verifier: oauthVerifier} = request.query
    console.log("oauthVerifier:",oauthVerifier)
    const oauth_token_secret = twitter_access_Token[0];
   if(oauth_token_secret){
    oauthRequestToken=oauth_token_secret.oauthRequestToken;

    oauthRequestTokenSecret=oauth_token_secret.oauthRequestTokenSecret;
    
    const { oauthAccessToken, oauthAccessTokenSecret, results } = await getOAuthAccessTokenWith({ oauthRequestToken, oauthRequestTokenSecret, oauthVerifier })
    
    console.log('user succesfully logged in with twitter', results)
    
    const { user_id: userId /*, screen_name */ } = results

    const user = await oauthGetUserById(userId, { oauthAccessToken, oauthAccessTokenSecret })    
    
    console.log(user,"user");

    twitter_access_Token=[];
    
    reply.redirect('/')
   
   }
    // console.log('/twitter/callback', { oauthRequestToken, oauthRequestTokenSecret, oauthVerifier })

    
  }catch(err){
    console.log(err);
  }
  }


  // {
  //   user_id: '1346806823144198146',
  //   screen_name: 'AyushMe21857759'
  // }
  // {
  //   statusCode: 403,
  //   data: '{"errors":[{"message":"You currently have Essential access which includes access to Twitter API v2 endpoints only. If you need access to this endpoint, you’ll need to apply for Elevated access via the Developer Portal. You can learn more here: https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api#v2-access-leve","code":453}]}\n'
  // }
