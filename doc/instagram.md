# Integrate Instagram Basic Display API with Node.js 


# Goals
We will integrate the Instagram basic display API on a Node.js GraphQL API.
Without Passport js 

# Prerequisites
 it is necessary to have:

- Node.js installed on your computer.
- Working knowledge of graph Instagram.
- Working knowledge of JavaScript
- Facebook developer account
# Creating a Facebook developer account
 To create a Facebook developer account, follow the following steps:

- Visit the Facebook developer page and on the right side, click Login.
- In the resulting page, key in your credentials and click Log In.
- After signing in, you will be directed to your dashboard page.
# Creating an app

![Alt text](https://res.cloudinary.com/dryfxhged/image/upload/v1654750667/nwcp3lo7brft9sgdn8zd.png?raw=true "Title")



# Adding an Instagram test user
- To use the Instagram basic display API in development, we will have to add a test user. To do so, we will follow the following steps:

- In the left sidebar, click on Roles and then Roles.

- Scroll to the bottom, and hit the Add Instagram Testers button.

- In the resulting pop-up, enter the username of the Instagram account you are going to use throughout the article. Make sure it’s an -  Instagram account you can log in to because you will be required to accept the request sent.

- On hitting Submit, the account will appear in the section with a Pending text attached to it. The owner of the Instagram account is supposed to accept it first to be complete.

- Log in to that particular Instagram account you have entered its username.

- In the settings section, find Apps and Websites. In the resulting section, click on the TESTER INVITES tab. Your recently created app should be listed there as follows:

- tester-invites

- Click on the Accept button.

- Hurray!!, your Instagram app is now configured, it’s time to set up our project.
# Getting the authorization code
- For us to use the API, the first step is to get the authorization code. It provides an authentication mechanism to the Instagram API.
# Save Credentials
```sh
  "instagramKey":{
     "CLIENTID":"4xxxxxxxxxxx4",
     "client_secret":"b7xxxxxxxxxbe3"
   }
```
# Routes Configuration
```sh
router.route("/instagram/url").get(instagramController.getInstagramAuthURL); //get 
router.route("/instagram").get(instagramController.redirectUriRoutes); //callback routes

app.use("/auth/instgram",router);


```


# How Instagram authentication works?
- We will hit ~ {backendURL}/auth/instagram//instagram/url ~ in our application to initiate authentication flow in our application. This will initiate our Instagram authentication by redirecting the user to Instagram(If not already logged In).
- Lets figure out how Instagram authentication works. On your page you have a Login button which redirects you to the Instagram login page at the url:
```sh
  var url =`https://api.instagram.com/oauth/authorize?client_id=`
            +CLIENTID+`&redirect_uri=`
            +YOUR_REDIRECT_URI
            +`&scope=user_profile,user_media&response_type=code`

        res.redirect(url);

 "https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=code"
```
- In our Instagram client we have all those query parameters so in our case the url should look like:
```sh
cosnt YOUR_REDIRECT_URI=http://localhost:8080//auth/instagram/instagram;
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
            }

   "https://api.instagram.com/oauth/authorize/?client_id=CLIENT_ID&redirect_uri=http://localhost:8080//auth/instagram/instagram&response_type=code"

  
```

- After being authorized it will redirect to /insta page(as configured on the above code) with a query parameter containing code. That code will be used to fetch short-lived access token on the backend.

```sh

"http://localhost:8080//auth/instagram/instagram?code=3304fe84xxxxxxxxxxxxxxxxxxdec"

```


# Getting user profile data
- On an Instagram account, we can be able to get the profile data of that specific account. The profile data here involves the account type, id, media count, and username.
```sh
const  getUserInfo= async (access_token)=> {
    
        let   userData = await axios.get("https://graph.instagram.com/me", {
              params: {
                fields: "id,username,media_count,account_type",
                access_token: access_token,
              },
              headers: {
                host: "graph.instagram.com",
              },
            });
            return userData;

}

            
userData=>    data: {
      id: '49XXXXXXX031',
      username: 'lucy_XXXXanhusky',
      media_count: 20,
      account_type: 'MEDIA_CREATOR'
      }

const  getUserPostMedia= async (access_token)=> {

        let   postMedia = await axios.get("https://graph.instagram.com/me/media", {
              params: {
                fields:
                  "id,caption,media_url,media_type,permalink,thumbnail_url,timestamp,username",
                access_token: access_token,
              },
              headers: {
                host: "graph.instagram.com",
              },
            });

            return postMedia;
      
}

```



To get a long-lived access token, we will follow the following steps:
 If you go to https://developers.facebook.com/docs/instagram-api/getting-started/ you can run through the steps online to see what the various URLs and responses look like
