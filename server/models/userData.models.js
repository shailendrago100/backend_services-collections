const Mongoose          = require("mongoose");
const crypto            = require("crypto");
const appConstants      = require("../utils/appConstants");
const { number }        = require("joi");
const Schema = Mongoose.Schema;
const userDataSchema = new Schema(
    {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      trim: true,
    },
    
    profilePic: {
      type: String,
    },
    firebaseUID: {
      type: String,
    },
    loginType: {
      type: String,
      enum: [appConstants.firebaseLogin,appConstants.googleLoginIn,appConstants.githubLogIn,appConstants.facebookLogin,appConstants.instagramLogin,appConstants.twitterLogin],
    },
    googleInfo: {
     
      googleId: {
        type: String
      },
      firstName: {
        type: String
      },
      lastName: {
        type: String
      },
      profilePic: {
        type: String
      },
      email:{
        type: String
      }
    },
    facebookInfo: {
     
      facebookId: {
        type: String
      },
      access_token:{
        type: String  
      },
      firstName: {
        type: String
      },
      lastName: {
        type: String
      },
      profilePic: {
        type: String
      },
      email:{
        type: String
      },
      phoneNumber:{
        type: String
      }
    },
    instagramInfo: {
     
      instagramId: {
        type: String
      },
      access_token:{
        type: String  
      },
      firstName: {
        type: String
      },
      lastName: {
        type: String
      },
      profilePic: {
        type: String
      },
      email:{
        type: String
      },

    },
    githubInfo: {
     
      githubId: {
        type: String
      },
      firstName: {
        type: String
      },
      lastName: {
        type: String
      },
      profilePic: {
        type: String
      },
    
    },
    twitterInfo: {
     
      twitterId: {
        type: String
      },
      firstName: {
        type: String
      },
      lastName: {
        type: String
      },
      profilePic: {
        type: String
      },
      email:{
        type: String
      },
    },
    deviceToken: {
      type: String,
    },
    deviceType:{
      type: Number,
      enum:[appConstants.deviceType_android,appConstants.deviceType_apple,appConstants.deviceType_website]
    },
    deviceDetails: [
      {
        deviceType: {
          type: String,
          enum:[appConstants.deviceType_android,appConstants.deviceType_apple,appConstants.deviceType_website]

        },
        deviceToken: {
          type: String,
        },
      },
    ],
    salt: {
      type: String,
    },
    resetPasswordOtp:{
      type: Number,
    },
    resetPasswordExpires:{
      type: Date,
    }
  },
  { timestamps: true }
);

userDataSchema.pre("save", function (next) {
  if (this.password && this.password.length > 0) {
    this.salt = new Buffer(crypto.randomBytes(16).toString("base64"), "base64");
    this.password = this.hashPassword(this.password);
  }
  next();
});


userDataSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto
      .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
      .toString("base64");
  } else {
    console.log("hashPassword",password)
    return password;
  }
};

userDataSchema.methods.authenticate = function (password) {
  console.log("password",this.password === this.hashPassword(password))

  return this.password === this.hashPassword(password);
};
module.exports = Mongoose.model("userData",userDataSchema);
