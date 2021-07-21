const jwt = require('jsonwebtoken')
const moment = require('moment')
const bcrypt = require("bcryptjs")
const config = require("../Config/auth")
const user = require("../Models/userModel")
const roles = require("../Models/rolesModel")
const respond = require("../Helper/respondHelper")

exports.signin = async (req, res) => {
  if (Object.keys(req.body).length == 0) {
    return respond.failed("Content can not be empty!",{},res)
  }

  try {
    let getUser = await user.findOne({username: req.body.username})
    if (!getUser) {
      return respond.notFound("User Not found.",{},res)
    }
    let passwordIsValid = bcrypt.compareSync(
      req.body.password,
      getUser.password
    );

    if (!passwordIsValid) {
      return respond.failed("Invalid Password!",{},res)
    }

    let token = jwt.sign({ id: getUser._id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    let updateUser = await user.findByIdAndUpdate(getUser._id,{
      token:token,
      expiredToken:moment().add(24,"hours").format('YYYY-MM-DD HH:mm:ss')
    },{new:true})

    return respond.success("successfully Registered",{
      id: updateUser._id,
      username: updateUser.username,
      email: updateUser.email,
      accessToken: token,
      expiredToken: updateUser.expiredToken
    },res)
  } catch (error) {
    console.log(error)
    return respond.failed("Bad Request.",{},res)
  }
};

exports.signup = async (req, res) => {
  if (Object.keys(req.body).length == 0) {
    return respond.failed("Content can not be empty!",{},res)
  }
  
  try {
    let checkUser = await user.findOne({
      username: req.body.username,
      email: req.body.email
    })
  
    if(checkUser){
      return respond.failed("email and username must be unique",{},res)
    }
  
    let data = {
      username : req.body.username,
      email : req.body.email,
      password : bcrypt.hashSync(req.body.password, 8),
      // roles: req.body.roles,
      created : moment().format('YYYY-MM-DD HH:mm:ss'),
      token: "",
      expiredToken: null
    }
    await user.create(data, (err, user) => {
      if (err) {
        return respond.failed("Bad Request.",{},res)
      }
      return respond.success("successfully Registered",{},res)
    });
  } catch (error) {
    return respond.failed("Bad Request.",{},res)
  }
}