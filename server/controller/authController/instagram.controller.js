var httpRequest              = require('request');
let getUserInfo              =require("../../services/authServices/instragram");
const config                 =require('config');
const instragramKey          =config.get("instagramKey");


const CLIENTID=instragramKey.CLIENTID;
const client_secret=instragramKey.client_secret;
const YOUR_REDIRECT_URI=config.get("SERVER_ROOT_URI")+"/auth/instagram/instagram";
// /auth/instagram/instagram            #callback_url 
module.exports = {
    getInstagramAuthURL: async (req, res) => {
   var url =`https://api.instagram.com/oauth/authorize?client_id=`
            +CLIENTID+`&redirect_uri=`
            +YOUR_REDIRECT_URI
            +`&scope=user_profile,user_media&response_type=code`

        res.redirect(url);
    },
    redirectUriRoutes: async (req, res) => {
        try {
            var options = {
                url: 'https://api.instagram.com/oauth/access_token',
                method: 'POST',
                form: {
                    client_id: CLIENTID,
                    client_secret: client_secret,
                    grant_type: 'authorization_code',
                    redirect_uri: YOUR_REDIRECT_URI,
                    code: req.query.code
                }
            };
            httpRequest(options,  async (error, response, body)=> {
                if (!error) {
                   var user = JSON.parse(body);
                    console.log(user.access_token,"user inside redirectUriRoutes ")

                    if(user.access_token){
                    let userInfo= await getUserInfo.getUserInfo(user.access_token);
                    
                    console.log(userInfo.data,"userInfo")

                    res.send(userInfo.data)
                    }else{
                        res.send({ userInfo: response })
                    }

                    
                } else {
                    console.log(response, " response.statusCode != 200 not found error");
                    res.send({ error: error })
                }
            });
        }
        catch (error)
        {
            res.send(error)
        }
    },
  }

  // const YOUR_REDIRECT_URI="https://authprojectseraphic.herokuapp.com/auth/instagram/instagram";

//   try{
//     let   response1 = await axios.get("https://graph.instagram.com/me", {
//           params: {
//             fields: "id,username,media_count,account_type",
//             access_token: "IGQVJYUHlpRG1CT0JDbUdHbV9sMjFMQWNYMjNNYXc1UnByZA0Q0dTgyTHNyOXAyemREQlhSUk5RelVXcWtpN240MnoydzlTc1d2R2dQdXYwTDZA1cVFfb1pKZADNFM3FZARk5LQkdfYmZAFM2V2T090SEFNMjZAqVGpiVzgzTXBV",
//           },
//           headers: {
//             host: "graph.instagram.com",
//           },
//         });
//     let   response = await axios.get("https://graph.instagram.com/me/media", {
//           params: {
//             fields:
//               "id,caption,media_url,media_type,permalink,thumbnail_url,timestamp,username",
//             access_token: "IGQVJYUHlpRG1CT0JDbUdHbV9sMjFMQWNYMjNNYXc1UnByZA0Q0dTgyTHNyOXAyemREQlhSUk5RelVXcWtpN240MnoydzlTc1d2R2dQdXYwTDZA1cVFfb1pKZADNFM3FZARk5LQkdfYmZAFM2V2T090SEFNMjZAqVGpiVzgzTXBV",
//           },
//           headers: {
//             host: "graph.instagram.com",
//           },
//         });
//         console.log(response.data,response1)
//       }catch(err){
//           console.log(err);
//       }


//      data: {
//      id: '4954274331366031',
//      username: 'lucy_thesiberianhusky',
//      media_count: 20,
//      account_type: 'MEDIA_CREATOR'
//      }
     