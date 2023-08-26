
// exports.getValidatedWithLinkedinUser=async (code, redirectUri) => {
//     const body = new URLSearchParams({
//       grant_type: 'authorization_code',
//       code,
//       redirect_uri: redirectUri,
//       client_id: process.env.LINKEDIN_CLIENT_ID,
//       client_secret: process.env.LINKEDIN_CLIENT_SECRET
//     })
//     const { access_token } = await fetchJSON(LINKEDIN_TOKEN, {
//       method: 'POST',
//       body
//     })
//     const payload = {
//       method: 'GET',
//       headers: { Authorization: `Bearer ${access_token}` }
//     }
//     const { localizedFirstName, localizedLastName } = await fetchJSON(
//       LINKEDIN_NAME,
//       payload
//     )
//     const userData = {
//       name: `${localizedFirstName} ${localizedLastName}`
//     }
//     const response = await fetchJSON(LINKEDIN_EMAIL, payload)
//     if (response.elements) {
//       userData.email = response.elements[0]['handle~'].emailAddress
//     }

//     return userData
//   }


// // exports.loginWithLinkedin = async (req, res, next) => {
// //     try {
// //         const { token } = req.body
// //         const result = await axios
// //             .post("https://www.linkedin.com/oauth/v2/accessToken", querystring.stringify({
// //                 grant_type: "authorization_code",
// //                 code: token,
// //                 redirect_uri: 'http://localhost:8080/register/linkedin-verif',
// //                 client_id: LINKEDIN_CLIENT_ID,
// //                 client_secret: LINKEDIN_CLIENT_SECRET
// //             }));
// //         const accessToken = result.data.access_token;
// //         const emailRequest = await axios
// //             .get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))&oauth2_access_token=' + accessToken);
// //         const email = emailRequest.data.elements[0]['handle~'].emailAddress;
// //         const profile = await axios
// //             .get('https://api.linkedin.com/v2/me',
// //                 {
// //                     headers: {
// //                         'Authorization': `Bearer ${accessToken}`,
// //                         'cache-control': 'no-cache',
// //                         'X-Restli-Protocol-Version': '2.0.0'
// //                     }
// //             });
        
// //         const jwtToken = signToken(user);
// //         res.cookie('access_token', jwtToken, {
// //             httpOnly: true
// //         });

// //         res.status(200).json({ jwtToken });
// //     }
// //     catch (error)
// //     {
// //         res.send({message:error})
// //     }
// // }
