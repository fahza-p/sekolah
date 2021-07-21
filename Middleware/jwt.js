const jwt = require('jsonwebtoken')
const config = require("../Config/auth")
const respond = require("../Helper/respondHelper")
const user = require("../Models/userModel")
const moment = require('moment')

exports.verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"]

  if (!token) {
    return respond.failed("No access token provided",{},res)
  }

  // Verify
  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return respond.unauthorized("Unauthorized!",{},res)
    }
    try {
      // Verify Expired
      let dataToken = await user.findById(decoded.id).select(["expiredToken","token"])
      if(!dataToken.expiredToken || !dataToken.token){
        return respond.unauthorized("Access Token was expired!",{},res)
      }

      if(dataToken.token != token){
        return respond.unauthorized("Access Token was expired!",{},res)
      }

      if(dataToken.expiredToken < moment().format('YYYY-MM-DD HH:mm:ss')){
        return respond.unauthorized("Access Token was expired!",{},res)
      }
    } catch (error) {
      return respond.failed("Bad Request.",{},res)
    }
    req.userId = decoded.id
    next()
  })
}