const user = require("../Models/userModel")
const respond = require("../Helper/respondHelper")
const helper = require("../Helper/commonHelper")

exports.findAll = async (req, res) => {
  const filter = req.query.filter ? req.query.filter : {username:{ $regex: '.*b.*' },email:{$regex:".*g.*"}}
  const sort = req.query.sort ? req.query.sort : {token:1,username:1}
  const nextKey = req.query.nextId ? {_id:req.query.nextId,token:null,username:"bupergata2"} : null
  const limit = req.query.limit ? req.query.limit : 3
  let {paginatedQuery, nextKeyFn} = helper.generatePagination(filter,sort,nextKey)
  try {
    let data = await user.find(paginatedQuery)
      .select(["-password","-__v","-token","-expiredToken"])
      .limit(limit)
      .sort(sort)
    return respond.success("successfully get data",data,res)
  } catch (error) {
    console.log(error)
    return respond.failed("Bad Request.",{},res)
  }
}

exports.findOne = async (req,res) => {
  if (Object.keys(req.query).length == 0) {
    return respond.failed("Content can not be empty!",error,res)
  }
  try {
    let userData = await user.findById(req.query.id).select(["-password","-__v","-token","-expiredToken"])
    userData = !userData ? {} : userData
    return respond.success("successfully get data",userData,res)
  } catch (error) {
    return respond.failed("Bad Request.",{},res)
  }
}

exports.update = async (req,res) => {
  if (Object.keys(req.body).length == 0) {
    return res.status(400).send({
      message: "Content can not be empty!"
    })
  }
  try {
    let checkId = await user.findById(req.body.id)
    if(!checkId){
      return respond.failed("User not found",{},res)
    }
    if(checkId._id != req.userId){
      return respond.failed("Can't change other than your account",{},res)
    }

    let data = {
      username:req.body.username,
      email:req.body.email
    }

    let update = await user.findByIdAndUpdate(req.body.id,data,{
      rawResult:true, 
      new:true
    }).select(["-password","-__v","-token","-expiredToken"])
    if(update.ok){
      return respond.success("successfully get data",update.value,res)
    }
  } catch (error) {
    return respond.failed("Bad Request.",{},res)
  }
}

exports.delete = async (req,res) => {
  if (Object.keys(req.body).length == 0) {
    return respond.failed("Content can not be empty!",{},res)
  }
  try {
    let checkId = await user.findById(req.body.id)
    if(!checkId){
      return respond.failed("User not found",{},res)
    }
  
    let del = await user.deleteOne({_id: req.body.id})
    if(del.ok){
      return respond.success("Content successfully delete",{},res)
    }
  } catch (error) {
    return respond.failed("Bad Request.",{},res)
  }
}

