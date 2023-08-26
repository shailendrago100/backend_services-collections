const universalFunctions       = require("../../utils/unversalFunction")
const multer                   = require("multer")
const Boom                     = require("boom")
const responseMessages         = require("../../resources/resources.json")
const { normalize }            = require("path")

let upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      console.log(file, "here is file ")
      callback(null, normalize(process.env.PWD || process.cwd() + "/uploads"))
    },
    filename: function (req, file, cb) {
      console.log(file, "here is file")
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname)
    },
  }),
  limits: {
    fileSize: "500mb",
  },
}).single("file")

module.exports = {
  UploadLocal: async (req, res) => {
    try {
      await upload(req, res, (error, file) => {
        if (error) {
          return universalFunctions.sendError(error, res)
        }
        if (!req.file) {
          throw Boom.badRequest(responseMessages.FAILED)
        } else if (req.file.length <= 0) {
          throw Boom.badRequest(responseMessages.UPLOAD_FILE)
        }
        let path = req.file.path
        console.log(req.file, "req.file")
        return universalFunctions.sendSuccess(
          {
            statusCode: 200,
            message: req.t("UPLOADFILES"),
            data: path,
          },
          res
        )
      })
    } catch (error) {
      return universalFunctions.sendError(error, res)
    }
  },
}
