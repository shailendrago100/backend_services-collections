
const cloudinary   = require('../../services/uploadService/cloudinary/cloudinary');
const {deleteFile} = require("../../utils/deleteFiles");

exports.upload_ON_Cloudinary =async (req, res) => {
    try{
      let lang="en";
      if(req.body.lang){
        lang=req.body.lang
      }
    const uploader = async (path) =>{

      let data= await cloudinary.uploads(path, 'uploads');
       return data;
        }
    
      const urls = []
      req.files &&
        req.files.map((val) => {
          val.path = (`./uploads/${val.filename}`);
        });
      const files = req.files;
    
      
      for (const file of files) {
        const { path,filename } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        console.log(filename,newPath,"FIENAME")
        await deleteFile(filename);
      }

  
      res.status(200).json({
        message: req.t("UPLOADFILES", { lng: lang }),
        data: urls
      })
    }catch(error){
        console.log(error,"error")
        throw error
    }
   
    }
