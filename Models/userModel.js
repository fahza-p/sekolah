const mongoose = require('mongoose')
const moment = require('moment')

const userSchema = new mongoose.Schema({
  username: {
    type:String,
    required: [true, 'Please fill your username']
  },
  email: {
    type:String,
    required: [true, 'Please fill your email']
  },
  password: {
    type:String,
    required: [true, 'Please fill password']
  },
  // roles: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Role",
  //     required: [true, 'Please fill roles']
  //   }
  // ],
  created: {
    type: String,
    default: moment().format('YYYY-MM-DD HH:mm:ss')
  },
  token: {
    type: String,
    default: ""
  },
  expiredToken: {
    type:String,
    default:null
  }
});

module.exports = mongoose.model("user", userSchema);