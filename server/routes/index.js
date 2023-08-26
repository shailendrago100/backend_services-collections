const express                   = require('express')
const facebookRoutes            = require("./authRoutes/facebook.routes");
const googleRoutes              = require("./authRoutes/google.routes");
const githubRoutes              = require("./authRoutes/github.routes");
const instagramRoutes           = require("./authRoutes/instagram.routes");
const twitterRoutes             = require("./authRoutes/twitter.routes");
const appAuthRoutes             = require("./authRoutes/appAuth.routes");
const costomAuthRouutes         = require("./authRoutes/customAuth.routes");

const router            = express.Router()
const defaultRoutes = [
  {
    path: '/facebook',
    route: facebookRoutes,
  },
  { 
    path: '/google',
    route: googleRoutes,
  },
  {
    path: '/github',
    route: githubRoutes,
  },
  {
    path: '/instagram',
    route: instagramRoutes,
  },
  {
    path: '/twitter',
    route: twitterRoutes,
  },
  {
    path: '/app',
    route: appAuthRoutes,
  },
  {
    path: '/customAuth',
    route: costomAuthRouutes,
  },
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
})

module.exports = router
