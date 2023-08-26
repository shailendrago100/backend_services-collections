const express                  = require("express")
const githubController         = require("../../controller/authController/github.controoler")


const router                   = express.Router()



router.get("/", githubController.gitRedirect)
router.get("/github/callback", githubController.getGithubData)

module.exports = router
