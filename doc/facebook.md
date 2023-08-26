# TWITTER OAUTH LOGIN WITH NODE.JS 


# Goals
Facebook Login/SignUp with Node.js

# Requirements
- To have a fully working HTTP server working together with facebook OAuth in Node.js you need
 an application created on facebook.twitter.com to be used to sign in with Twitter
- a Consumer API key and secret for the OAuth part
- an HTTP server
- some lightweight Node.js modules
- facebook  developer account
![Alt text](https://res.cloudinary.com/dryfxhged/image/upload/v1655179584/knibpklplpannzql6pkq.png "Title")


# Dependencies
 Using express as an example here, though you can use any other framework, the concept is the same.

 We need 4 useful modules from npm:
- oauth for generating the request and access tokens for the OAuth flow, and for authenticating to any OAuth enable HTTP API (like Twitter)
- express as the web server
-axios

# Overview
Your standard web OAuth 2.0 flow has 3 steps:

- Your app client opens a Facebook login dialog with your app's id and a URL to redirect the user to when they successfully authorize your app.
- The dialog redirects back to your app client's domain with an auth code in the query string. An auth code is a short-lived code that you can exchange for a long-lived access token.
- Your app pulls the code parameter from the query string, and makes a POST request to the Facebook with the access code. Facebook    verifies the access code and sends back an access token your app can use for authorization going forward. Your app is responsible for storing the access token.
- That means, to implement Facebook login, your Express app needs 3 routes:

   - A route that displays a UI which can open Facebook's login dialog.
   - A route that exchanges an auth code for an access token and stores the access token.
   - A route that does something with the access token.
#   Create a Facebook   APP 
![Alt text](https://res.cloudinary.com/dryfxhged/image/upload/v1655179584/knibpklplpannzql6pkq.png "Title")
![Alt text](https://res.cloudinary.com/dryfxhged/image/upload/v1655179583/cmalrldzs8r4gnajlsy7.png "Title")


# SAVE twitter credentials
file location :- config/default.json
```sh
  "facebookKey":{
   "appId" : "1121036925455124",
   "appSecret": "3912a21a8b19b58968f4b2a44cbb862d"
  },

  ```
#  Routes Configuration
```sh
router.get('/facebookLink', facebook.fbLink);
router.get('/oauth-redirect', facebook.getOauth);
router.get('/me', facebook.getToken);

app.use("/auth/facebook",router);


```
- We will hit ~ {backendURL}/auth/facebook/facebookLink ~ in our application to initiate authentication flow in our application. This will initiate our facebook authentication by redirecting the user to facebook(If not already logged In).

First, let's create a route that links the user to Facebook's login dialog. In the interest of keeping this example lean, no need for any templating languages. Just plain old HTML strings.



# Implementation

// Route 1: UI to redirect the user to Facebook's login dialog
```sh
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

 router.get('/facebookLink', facebook.fbLink);
}
```
- The above route just displays some HTML with a single link. The only detail worth noting is the appId variable in the URL. In order to do Facebook login, you need to register an app on developers.facebook.com and take the "App ID" and "App Secret" from your app's details page.


- For the purposes of this article, I'll assume that your "App ID" is in the appId variable, and your "App Secret" is in the appSecret variable.



 - The Facebook dialog URL also includes a redirect_uri parameter. That tells Facebook where to redirect with the auth code when the user has authorized your app. So you need to implement a /oauth-redirect endpoint that exchanges the auth code for an access token.
 
 

To exchange an auth code for an access token, you need to make an API request to the /access_token endpoint:

```sh
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
```

 At this point, the user is already logged in. Your app now has an access token that it can use to make requests to Facebook on behalf of the user. All that's left is to make a request to Facebook.Storing Access Tokens. The /me endpoint returns the name of the logged in user
```sh
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

```


To get a long-lived access token, we will follow the following steps:
 If you go to https://developer.twitter.com/en/docs/authentication/oauth-2-0 you can run through the steps online to see what the various URLs and responses look like


 # articel url:-

http://thecodebarbarian.com/passport-free-facebook-login-with-node-js.html