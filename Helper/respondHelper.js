exports.success = (msg,data,res) => {
  let result = {
    status:"success",
    message:msg,
    result:data
  }
  return res.status(200).send(result)
}

exports.failed = (msg,data,res) => {
  let result = {
    status:"failed",
    message:msg,
    result:data
  }
  return res.status(400).send(result)
}

exports.unauthorized = (msg,data,res) => {
  let result = {
    status:"unauthorized",
    message:msg,
    result:data
  }
  return res.status(401).send(result)
}

exports.notFound = (msg,data,res) => {
  let result = {
    status:"not found",
    message:msg,
    result:data
  }
  return res.status(404).send(result)
}