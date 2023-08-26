const axios                         =require("axios");
const { response }                  =require("express");
const models                        =require("../../models")
const  universalFunctions           =require("../../utils/unversalFunction");
const appConstants                  =require("../../utils/appConstants")
const responseMessages              =require("../../resources/resources.json")
const config                        =require("config");

const githubKey=config.get("githubKey")
const clientID = githubKey.GITHUB_CLIENT_ID;
const clientSecret = githubKey.GITHUB_CLIENT_SECRET;

exports.gitRedirect=(req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientID}`) 
}
exports.getGithubData = async (req, res) => {
    try {
        const requestToken = req.query.code;
        let access_token;
        let userData,payload,isExits;
        axios({
        method: 'post', 
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,    
        headers: { accept: 'application/json'}

        }).then((response) => {
            access_token = response.data.access_token

            axios(
                {
                    method: 'get',
                    url: `https://api.github.com/user`,
                    headers: { 
                        Authorization: 'token ' + access_token
                    }
            }).then(async(response) => {

                if (response && response.data)
                
                    userData = response.data;
                    payload = {
                        githubInfo:userData,
                    userId: userData.id,
                    firstName: userData.login,
                    email: userData.email,
                    profilePic: userData.picture,
                    loginType:appConstants.githubLogIn,
                    }
                 isExits = await models.userSchema.findOne({ "githubInfo.githubId": userData.id })
                if (!isExits) {

                    await models.userSchema.create(payload)
                }
            return universalFunctions.sendSuccess(
            {
                statusCode: 200,
                message:responseMessages.SUCCESS,
                data:response.data,
            },res);
          })
        })
    }
    catch (error)
    {
      return universalFunctions.sendError(error, res)
    }
}

