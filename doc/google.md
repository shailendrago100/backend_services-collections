# Google OAuth2 Authentication in NodeJS

# Goal
 Google OAuth integration with NodeJS 

 # Prerequisites
 it is necessary to have:

- Node.js installed on your computer.
- Have a good understanding of OAuth
- Working knowledge of JavaScript
- google developer account
- Be able to build OAuth integrations 
- install axios googleapis 

# Dependencies  

"express": "^4.18.1",
"googleapis": "^100.0.0",
"axios": "^0.27.2",

#   Create a Google client ID and client secret
- We can create a client ID and client secret using its Google API Console. You need to follow below steps once you open Google API     Console
- From the project drop-down, select an existing project, or create a new one by selecting Create a new project
- In the sidebar under "APIs & Services", select Credentials
- In the Credentials tab, select the Create credentials drop-down list, and choose OAuth client ID.
- Under Application type, select Web application.
- In Authorized redirect URI use http://localhost:8080/auth/google/google
![Alt text](https://res.cloudinary.com/dryfxhged/image/upload/v1654767386/ewebaexxug6v08nh0nex.png?raw=true "Title")


```sh
router.route("/google").get(googleController.redirectUriRoutes); //callback routes
app.use("/auth/google",router);

```
- Press the Create button and copy the generated client ID and client secret
- Note: If Google doesn't support http://localhost:8080, then use http://127.0.0.1:300

- save Credentials
```sh
"googleKey": {
     "GOOGLE_CLIENT_ID":"192073xxxxxxxxxxxxxxxxxxxxxxcontent.com",
      "GOOGLE_CLIENT_SECRET" :"GOCSPX-PxxxxxxxxxxxxxxxxlW4rOWluUSr0jE5",
     "redirectURI" : "auth/google/google" // redirectURI path 
     },
```


#  Routes Configuration
```sh

router.route("/google/url").get(googleController.getGoogleAuthUR); 
router.route("/google").get(googleController.redirectUriRoutes); //callback routes
app.use("/auth/googlr",router);


```

# generateAuthCodeUrl 
it will redirect to google auth url  from that  you can log or sign in with google 

1 Construct an accounts.google.com URL with 4 query params :-
-  client_id to identify your app
- scope to say what permissions you're asking for
- redirect_uri to tell Google where to redirect the user's browser with the result
- response_type=code to say you want an Auth Code 
```sh
code services/google.service.js

function getGoogleAuthURL() {

        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const options = {
            redirect_uri: `${SERVER_ROOT_URI}/auth/google/google`,
            client_id: GOOGLE_CLIENT_ID,
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(' '),
        };
        
        return `${rootUrl}?${querystring.stringify(options)}`;
    
 
}
```
2 redirect the user's browser to that URL
3 Have a sip of coffee while the user logs in, chooses his Google account, and grants permission, until eventually ...
4 The user's browser gets redirected back to your app's redirect_uri, with a query param of code which is the one-time Auth Code
- We will hit ~ {backendURL}/auth/google/google/url ~ in our application to initiate authentication flow in our application. This will initiate our google authentication by redirecting the user to google(If not already logged In).

# app's redirect_uri
```sh
{
  http://localhost:8080/auth/google/google //callbackURL
  router.route("/google").get(googleController.redirectUriRoutes); 
 }
```
-  Post the Auth Code to Google's token endpoint
-  Use the Access Token in a "authorization: bearer access_token" http header for your subsequent Google API requests
```sh
function getGooleAccessTokens({
  code,
  clientId,
  clientSecret,
  redirectUri,
}) {
 const url = 'https://oauth2.googleapis.com/token';
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  };
   return axios.post(url, querystring.stringify(values), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((res) => res.data).catch((error) => {
      throw new Error(error.message);
    });
}
```

- Parse the JSON response to get the Access Token
```sh

      const googleUser =  axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
      ).then((res) =>{return   res.data})
      .catch((error)) =>{ 
        throw new Error(error.message);
      }

      ;
```

 
 If you go to https://developers.google.com/people/quickstart/nodejs you can run through the steps online to see what the various URLs and responses look like
