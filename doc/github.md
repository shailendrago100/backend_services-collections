Before You Get Started


#  github Authentication in NodeJS

# Goal
 Google OAuth integration with NodeJS 



 # Prerequisites
 it is necessary to have:
- Basic understanding of OAuth
- A good understanding of JavaScript and Node.js
- Latest Node.js version installed on your system

 dependencies  

"express": "^4.18.1",
"axios": "^0.27.2",


# Step 1: Register a Github OAuth App
To implement Github Auth we need to register a new application in Github OAuth Apps.

Once you start the process you will get a form like this.
![Alt text](https://res.cloudinary.com/dryfxhged/image/upload/v1655878927/x7aguys7qhjgw8flwgey.png "Title")
![Alt text](https://res.cloudinary.com/dryfxhged/image/upload/v1655878928/lo8m4lphfegrkv2fzbhe.png "Title")

You need to fill all the required details and put the Authorization callback URL as http://localhost:8080/auth/github/github/callback (This will be the URL on which Github will send the authorization code once authorization is finished)

Once you register the application you will get the App's Client Id and Secret which we will use in our code.

# save Credentials
```sh
  "githubKey":{
   "GITHUB_CLIENT_ID": "bdaxxxxxxxxxxxf5a62ec89",
   "GITHUB_CLIENT_SECRET":"d139xxxxxxxxxxxxxxxxxxx6e76f8d8795d1"
  },
```

#  Routes Configuration

```sh
router.get("/", githubController.gitRedirect)
router.get("/github/callback", githubController.getGithubData)



app.use("auth/github",githubRoutes);

```





- Now that you have a Client Id and Client Secret, you can build a minimal Express API that redirects to GitHub to authorize your app:

```sh
exports.gitRedirect=(req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientID}`) 
}

```
- Run this app, go to http://localhost:8080/auth/github, and you'll see a GitHub login screen.

- When you log in, GitHub will redirect to your redirect URL, which should be http://localhost:8080/auth/github/github/callback, with a code parameter in the query string. 
- Your Express server needs to then make an HTTP POST request to https://github.com/login/oauth/access_token to exchange this access code for an access token. 
- Your app should store this access token in a database like MongoDB. But, for the sake of a simple example, let's keep the access token in memory.
```sh 
getGithubData = async (req, res) => {
     const  requestToken = req.query.code;
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

                if (response && response.data){
                    console.log(respose);
                }
     
        })
}
   

```
image 


- Now, you can go all the way through the GitHub OAuth flow and get a GitHub token. That's how you can handle logging in with GitHub, next let's use the token to make some basic API requests.