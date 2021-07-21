const mongoose = require('mongoose')
const moment = require('moment')

const roleSchema = new mongoose.Schema({
  name: {
    type:String,
    required: [true, 'Please fill your role name']
  },
  created: {
    type: String,
    default: moment().format('YYYY-MM-DD HH:mm:ss')
  },
});

module.exports = mongoose.model("role", roleSchema);