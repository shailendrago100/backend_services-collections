const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSessionSchema = new Schema(
  {
    userId: { type: Schema.ObjectId, ref: "User" },
    deviceType: {type: Number},
    signInAt: {type: Date, default: Date.now},
  },
  { timestamps: true }
);

module.exports = mongoose.model("usersession", userSessionSchema);
