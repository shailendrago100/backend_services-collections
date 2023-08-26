const AWS                      = require('aws-sdk');
const multer                   = require('multer');
const multerS3                 = require('multer-s3');
const config                   = require("config");
const fs                        = require('fs');
AWS.config.update({
  region: "ap-southeast-1",
  accessKeyId: "AKIAX6A5OHSPX6XUGOFL",                        
  secretAccessKey: "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",
});
// API_KEY: AKIAX6A5OHSPX6XUGOFL
// API_SECRET: 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
const s3 = new AWS.S3();

const BUCKET_NAME = "trudoc-seraphic";

  // Upload File to S3
  const uploadFile = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: BUCKET_NAME,
        key: function (req, file, cb) {
          console.log(file,"files")
            cb(null, file.originalname)
        }
    })
  })
  const uploadFile2 = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName.path);

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName.originalname, // File name you want to save as in S3
        Body: fileContent,
        // ACL:'public-read'

    }

    // Uploading files to the bucket
   let data= s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        return data.endpoint;
    });
    return data;
};

  // Download File from S3
  const downloadFile = async (filename) => {
    try {
      const res = await s3.getObject({ Bucket: BUCKET_NAME, Key: filename }).promise();
      return { success: true, data: res.Body }
    } catch(error) {
      return { success: false, data: null }
    }
  }
  
  // Delete File from S3
  const deleteFile = async (filename) => {
    try {
      await s3.deleteObject({ Bucket: BUCKET_NAME, Key: filename }).promise();
      return { success: true, data: "File deleted Successfully" }
    } catch(error) {
      return { success: false, data: null }
    }
  }
    
  // List All Files Names from S3
  const listFiles = async () => {
    try {
      const files = await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise();
      const names = files.Contents.map(file => file.Key)
      return { success: true, data: names }
    } catch(error) {
      return { success: false, data: null }
    }
  }

  module.exports={
  uploadFile,
  uploadFile2,
  downloadFile,
  deleteFile,
  listFiles
}
// Bucket Name: trudoc-seraphic
// region= ap-southeast-1
// API_KEY: AKIAX6A5OHSPX6XUGOFL
// API_SECRET: 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