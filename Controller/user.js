const user = require("../Models/userModel")
const respond = require("../Helper/respondHelper")
const helper = require("../Helper/commonHelper")

exports.findAll = async (req, res) => {
  const filter = req.query ? helper.filter(req.query) : {}
  const sort = req.query.sort ? req.query.sort : {_id:1}
  const nextKey = req.query.next ? req.query.next : null
  const limit = req.query.limit ? parseInt(req.query.limit) : 3
  // return
  let {paginatedQuery, nextKeyFn} = helper.generatePagination(filter,sort,nextKey)
  try {
    let data = await user.find(paginatedQuery)
      .select(["-password","-__v","-token","-expiredToken"])
      .limit(limit)
      .sort(sort)
    let nextData = data[data.length -1]
    let paginationData = await helper.paginationData(user,filter,limit,nextData,sort)
    console.log(paginationData)
    let result = {
      data:data,
      pagination: paginationData
    }
    return respond.success("successfully get data",result,res)
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

