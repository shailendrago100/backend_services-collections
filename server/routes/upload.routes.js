const express               = require('express');
const router                = express.Router();
const upload                = require("../controller/Upload/multer")
const multerFiles           = require('../services/multer');
const cloudinary            = require("../controller/Upload/cloudinaryUpload");
const s3_controller         = require("../controller/Upload/s3controller");
const multerS3              = require("../services/uploadService/s3Service");  
const filesUpload           = require("./../controller/Upload/index")
router.route("/fileUpload").post(multerFiles.array('file'),filesUpload.uploadFile);
router.route("/cloudinaryUpload").post(multerFiles.array('file') ,cloudinary.upload_ON_Cloudinary); //file can be mp4/image 
router.route("/s3/getfiles").get(s3_controller.getListFiles);
router.route("/s3/download").get(s3_controller.downloadfile);
router.route("/s3/delete").delete(s3_controller.deleteFile);
router.route("/s3/uploadfiles").post(multerFiles.array('file') ,s3_controller.S3Upload);
router.route("/fileUpload/multer").post(upload.UploadLocal);

// router.route("/s3/uploadfiles").post(multerS3.uploadFile.single("file"),s3_controller.S3Upload);



module.exports = router;