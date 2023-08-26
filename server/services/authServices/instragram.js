const axios = require("axios");

const  getUserInfo= async (access_token)=> {
    try{
        let   userData = await axios.get("https://graph.instagram.com/me", {
              params: {
                fields: "id,username,media_count,account_type",
                access_token: access_token,
              },
              headers: {
                host: "graph.instagram.com",
              },
            });
        // let   response = await axios.get("https://graph.instagram.com/me/media", {
        //       params: {
        //         fields:
        //           "id,caption,media_url,media_type,permalink,thumbnail_url,timestamp,username",
        //         access_token: access_token,
        //       },
        //       headers: {
        //         host: "graph.instagram.com",
        //       },
        //     });

            return userData;
          }catch(err){
              console.log(err,"err inside getUserInfo ");
              throw err
          }
}
exports.getUserInfo=getUserInfo;


