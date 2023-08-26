const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailTemplateSchema = new Schema(
  {
    subject: { type:String},
    htmlBody: { type:String},
    type:{type: String},
  },
  { timestamps: true }
);

module.exports = mongoose.model("emailtemplate", emailTemplateSchema);
