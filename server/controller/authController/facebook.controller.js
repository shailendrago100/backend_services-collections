const axios               = require("axios");
const config              = require("config");
const facebookServices    =require("../../services/authServices/facebook")
const facebookKey=config.get("facebookKey");
const appId =facebookKey.appId;
const appSecret = facebookKey.appSecret;
const SERVER_ROOT_URI = config.get("SERVER_ROOT_URI");
const accessTokens = new Set();
exports.facebookURL = (req, res) => {
  res.send(`
    <html>
      <body>
      <div>
      <span>
        <a href="https://www.facebook.com/v6.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(`${SERVER_ROOT_URI}/auth/facebook/oauth-redirect`)}"> Log In With Facebook
        </a>
        </span>
        </div>
      </body>
    </html>
  `);
}

exports.getOauth = async (req, res) => {
  try {
    const authCode = req.query.code;
    if (!authCode)
    {
      res.send({messge:"authCode Is Not Found"})
    }
    const accessTokenUrl=  facebookServices.generateAccessToken(authCode)

  console.log("accessTokenUrl",accessTokenUrl)
      const accessToken = await axios.get(accessTokenUrl).then(res =>{return res.data.access_token});
      accessTokens.add(accessToken);
      console.log(accessToken,"accessToken");
      res.redirect(`/auth/facebook/me?accessToken=${encodeURIComponent(accessToken)}`);
  }
  catch (error)
  {
      res.send({error})
  }

},
exports.getToken= async (req, res) => {
  try { 
    const accessToken = req.query.accessToken;
   
    let data = await axios.get(`https://graph.facebook.com/me?fields=id%2Cname%2Cpicture%2Cabout%2Cbirthday%2Cemail%2Cgender%2Clast_name%2Cposts%2Calbums%7Bphotos%7Bpicture%7D%7D&access_token=${encodeURIComponent(accessToken)}`).
      then(res => {return res});
      console.log(data)
    let name=data&&data.name?data.name:"";
    let lastName=data &&data.last_name?data.last_name:"";
    let facebookId=data && data.id?data.id:"";
    let profilepic=data&&data.picture?data.picture.data.url:"";

    
      let dataToSave={
        name:name,
        lastName:lastName,
        id:facebookId,
        facebookJson:data,
        profilepic:profilepic
      }
      console.log(dataToSave,"dataToSave");
    return res.send(`
      <html>
        <body>Your name is ${data.data}</body>
      </html>
    `);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.response.data || err.message });
  }
}

// https://graph.facebook.com/v14.0/me?fields=id%2Cname%2Cpicture%2Cabout%2Cbirthday%2Cemail%2Cgender%2Clast_name%2Cposts%2Calbums%7Bphotos%7Bpicture%7D%7D&access_token=EAAP7k7ZB4yxQBACzlpZAdYZCCLBjjziKucEaAIravAgKxX0cITHARfa3srwMNiKIJ1p9f4sZAxMh6a3uqVGSEOyndPFA7PywDerfW3ianlnQ7sBaW7zodZCyY4Ll2AXPL2XqPPSmnZAbmwHSpXJkdhzxymjsU0hyLOom50IALZA0y2UucSGGqZBkcnvEQNT6jeOO8Ts2HYvNwDbSedM125HkDMSKZC3q54KrhSZAsv8qngFQZDZD