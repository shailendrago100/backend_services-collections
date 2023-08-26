const {
  uploadFile,
  downloadFile,
  deleteFile,
  listFiles,
  uploadFile2,
} = require("../../services/uploadService/s3Service")
const deleteFiles = require("../../utils/deleteFiles")

// List All Files from S3
module.exports = {
  // Upload File from S3
  getListFiles: async (req, res) => {
    const { success, data } = await listFiles()

    if (success) {
      return res.json({ success, data })
    }
    return res
      .status(500)
      .json({ success: false, message: "Error Occured !!!" })
  },

  // Upload File from S3
  S3Upload: async (req, res) => {
    try {
      console.log(req.files)
      let lang = "en"
      if (req.body.lang) {
        lang = req.body.lang
      }
      let data = await uploadFile2(req.files[0]).promise()
      console.log("data.Location :=>", data.Location)
      const files = req.files

      for (const file of files) {
        const { filename } = file
        console.log(filename, "FIENAME")
        await deleteFiles.deleteFile(filename)
      }
      return res.json({
        success: true,
        message: req.t("UPLOADFILES", { lang: lang }),
        data: data,
      })
    } catch (error) {
      throw error
    }
  },

  S3MultiFileUpload: async (req, res) => {
    try {
      let lang = "en"
      if (req.body.lang) {
        lang = req.body.lang
      }
      const files = req.files
      let url = []

      for (const file of files) {
        const newPath = await uploadFile2(file)
        url.push(newPath)
      }
      uploadFile2(req.files[0])
      return res.json({
        success: true,
        message: req.t("UPLOADFILES", { lang: lang }),
        data: url,
      })
    } catch (error) {
      console.log(error)

      throw error
    }
  },
  // downloadfile File from S3
  downloadfile: async (req, res) => {
    try {
      const filename = req.query.filename
      console.log(req.query, "filenames")
      const { success, data } = await downloadFile(filename)
      if (success) {
        return res.json({ success, data })
      }
      return res
        .status(500)
        .json({ success: false, message: "Error Occured !!!" })
    } catch (err) {
      throw err
    }
  },
  // Delete File from S3
  deleteFile: async (req, res) => {
    try {
      const filename = req.query.filename
      const { success, data } = await deleteFile(filename)
      if (success) {
        return res.json({ success, data })
      }
      return res
        .status(500)
        .json({ success: false, message: "Error Occured !!!" })
    } catch (error) {
      throw error
    }
  },
}
