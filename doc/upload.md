# Upload multiple/single files in Node.js
# multer  
- file location  server/controllers/Upload/multer.js


```sh
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
}).single("file")    // in postman key name must be "file" 

```


# You can see that we have two options here:
- destination determines folder to store the uploaded files.
- filename determines the name of the file inside the destination folder


#  Routes Configuration
```sh

router.route("/fileUpload/multer").post(upload.UploadLocal);
app.use("upload",uploadRoutes);

```


 # upload file on cloudinary 

 Now let’s configure Multer as a middleware that we can use with any route that needs to upload an image. On the middleware folder, create a multer.js file with the following configuration.
 ```sh
 const storage = multer.diskStorage({
      
  destination: function (req, file, callback) {
    callback(null, normalize(process.env.PWD || process.cwd()+ "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); 
  },
}) 



 ```
-  Add Middleware 
```sh
router.route("/cloudinaryUpload").post(multerFiles.array('file') ,cloudinary.upload_ON_Cloudinary); //file can be mp4/image 
multerFiles.array('file') // for upload multi file in local first 
```
Upload from a local path

- You can upload an asset by specifying the local path of a media file.
 This option is only available when using Cloudinary's SDKs. For example:
```sh
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
```



# file upload/delete/getfileslist/downloadFiles S3 bucket

# Prerequisites

- An AWS account. If you don’t have an existing AWS subscription, you can sign up for an AWS Free Tier.
- An AWS S3 bucket. You can use an existing bucket if you’d prefer. Still, it is recommended to create an empty bucket instead. Please refer to Creating a bucket.
- The AWS CLI version 2 tool must be installed on your computer.
- Local folders and files that you will upload or synchronize with Amazon S3
# Dependencies
 AWS                      
 multer                   
 multerS3                 
 fs                      


 # First step 
  Now let’s configure Multer as a middleware that we can use with any route that needs to upload an image. On the middleware folder, create a multer.js file with the following configuration.
 ```sh
 const storage = multer.diskStorage({
      
  destination: function (req, file, callback) {
    callback(null, normalize(process.env.PWD || process.cwd()+ "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); 
  },
}) 
```
#  Add Middleware 
```sh
router.route("/cloudinaryUpload").post(multerFiles.array('file') ,cloudinary.upload_ON_Cloudinary); //file can be mp4/image 
multerFiles.array('file') // for upload multi file in local first 
```
# nowUpload from a local path

You can upload an asset by specifying the local path of a media file. This option is only available when using Cloudinary's SDKs. For example:

```sh
{

   uploadFile2 :(fileName) => {
    const fileContent = fs.readFileSync(fileName.path);

    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName.originalname, // File name you want to save as in S3
        Body: fileContent,

    }

   let data= s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        return data.endpoint;
    });
    return data;
}
 S3Upload:  (req, res) => {

      let data = await uploadFile2(req.files[0]).promise()
      console.log("data.Location :=>", data.Location)
      const files = req.files

      for (const file of files) {
        const { filename } = file
        console.log(filename, "FIENAME")
        await deleteFiles.deleteFile(filename) #  optional if you want to store these file in local as well  so remove this for loop  
      }
      return res.json({
        success: true,
        message: req.t("UPLOADFILES", { lang: lang }),
        data: data,
      })
   
  },
}
```

