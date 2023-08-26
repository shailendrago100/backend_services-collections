const cloudinary      = require("../../services/uploadService/cloudinary/cloudinary")
const Boom            = require("boom")
const { uploadFile2 } = require("../../services/uploadService/s3Service")
const deleteFiles      = require("../../utils/deleteFiles")
const responseMessage  =require("./../../resources/resources.json");

exports.uploadFile = async (req, res) => {
  try {
    let uploadType = req.query.type
    let lang="en";
    if(req.query.lang){
      lang=req.query.lang
    }
    if (uploadType == "s3") {
      console.log(req.files)

      let data = await uploadFile2(req.files[0]).promise()
      console.log("data.Location :=>", data.Location)
      
       res.status(200).json({
        message: req.t("UPLOADFILES",{lng:lang}),
        data: data,
      })
    } else if (uploadType == "cloudinary") {
      const uploader = async (path) => {
        let data = await cloudinary.uploads(path, "uploads")
        return data
      }

      const urls = []
      const files = []
      req.files &&
        req.files.map((val) => {
          if (isVideo(val) || isImage(val)) {
            files.push({
              path: `./uploads/${val.filename}`,
            })
            //   val.path = (`./uploads/${val.filename}`);
          }
        })

      //    console.log(files.length)
      if (files.length == 0) {
        res.status(200).json({
          status: 400,
          message: "upload image/video only",
        })
      } else {
        for (const file of files) {
          const { path } = file
          const newPath = await uploader(path)
          urls.push(newPath)
        }
        res.status(200).json({
          message: req.t("UPLOADFILES",{lng:lang}),
          data: urls,
        })
      }
    } else if (uploadType == "multer") {
      let files = req.files
      if (files.length > 0) {
        res.status(200).json({
          message: req.t("UPLOADFILES",{lng:lang}),
          data: files,
        })
      } else {
        throw Boom.badRequest(responseMessage.NO_FILES_UPLOAD)
      }
    } else {
      res.status(200).json({
        status: 400,
        message: "upload type is invalid",
      })
    }

    //delete upload if type is not multer
    if (!uploadType == "multer") {
      const files = req.files
      for (const file of files) {
        const { filename } = file
        console.log(filename, "FIENAME")
        await deleteFiles.deleteFile(filename)
      }
    }
  } catch (error) {
    console.log(error, "error")
    throw error
  }
}

function isImage(file) {
  return file["mimetype"].split("/")[0] == "image" //returns true or false
}
function isVideo(file) {
  return file["mimetype"].split("/")[0] == "video" //returns true or false
}
