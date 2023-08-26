const cloudinary              = require("cloudinary")
const config                  = require("config");

require("dotenv").config();
let cloudinaryConfig = config.get("cloudinaryConfig")
cloudinary.config({
  cloud_name: cloudinaryConfig.CLOUD_NAME,
  api_key: cloudinaryConfig.API_KEY,
  api_secret: cloudinaryConfig.API_SECRET
})

exports.uploads = (file, folder) => {
    return new Promise(resolve => {
      cloudinary.uploader.upload(file, (result) => {
          
        resolve({
          url: result.url,
          id: result.public_id
        })
      }, {
        resource_type: "auto" ,
        folder: folder
      })
    })
  }
