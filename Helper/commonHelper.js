exports.generatePagination = (query, sort, nextKey) => {
  const sortField = Object.keys(sort).length == 0 ? null : Object.keys(sort)

  function nextKeyFn(items) {
    if (items.length === 0) {
      return null
    }
    const item = items[items.length - 1]
    if (sortField == null) {
      return { _id: item._id }
    }
    return { _id: item._id, [sortField]: item[sortField] }
  }

  let paginatedQuery = query;
  if (nextKey == null) {
    return { paginatedQuery, nextKeyFn };
  }

  if (Object.keys(sort).length == 0) {
    paginatedQuery._id = { $gt: nextKey._id };
    return { paginatedQuery, nextKey };
  }

  let paginationQuery = []
  sortField.forEach(val => {
    let sortOperator = sort[val] === 1 ? "$gt" : "$lt"
    paginationQuery.push(
      { [val]: { [sortOperator]: nextKey[val] } }
    )
  })
  // const sortOperator = sort[1] === 1 ? "$gt" : "$lt";
  // paginationQuery = [
  //   { [sortField]: { [sortOperator]: nextKey[sortField] } },
  //   {
  //     $and: [
  //       { [sortField]: nextKey[sortField] },
  //       { _id: { [sortOperator]: nextKey._id } }
  //     ]
  //   }
  // ];

  // if (paginatedQuery.$or == null) {
  //   paginatedQuery.$or = paginationQuery;
  // } else {
  // }
  paginatedQuery = { $and: [query, { $or: paginationQuery }] };

  return { paginatedQuery, nextKeyFn };
}

exports.paginationData = async (db,filter,limit,nextData,sort) => {
  let totalData = await db.countDocuments(filter)
  let currentPage = 1
  let totalPage = Math.ceil(totalData / limit)
  let totalDisplay = limit
  if(currentPage == totalPage && (totalData % limit) != 0){
    totalDisplay = totalData % limit
  }

  let nextKey = {}
  if(currentPage != totalPage){
    Object.keys(sort).forEach(val => {
      nextKey[val] = nextData[val]
    })
  }
  
  let result = {
    totalData: totalData,
    totalPage: totalPage,
    currentPage: currentPage,
    totalDisplay: totalDisplay,
    nextKey : nextKey
  }
  return result
}

exports.filter = (filter) => {
  let result = {}
  let split = []
  for (const [key, value] of Object.entries(filter)) {
    if(typeof value === 'object' && key !== 'next' && key !== 'sort'){
      let data = Object.values(value)
      switch (Object.keys(value)[0]) {
        case "like": result[key] = {$regex: data[0], $options:"$i"} 
          break
        case "start": result[key] = {$regex:`^${data[0]}`, $options:"$i"} 
          break
        case "end": result[key] = {$regex:`${data[0]}e$`, $options:"$i"} 
          break
        case "=": result[key] = {$eq: data[0]}
          break
        case "!=": result[key] = {$ne: data[0]}
          break
        case "gt": result[key] = {$gt: data[0]}
          break
        case "lt": result[key] = {$lt: data[0]}
          break
        case "gte": result[key] = {$gte: data[0]}
          break
        case "lte": result[key] = {$lte: data[0]}
          break
        case "bet": 
          split = data[0].split("::")
          result[key] = {$gt: split[0], $lt: split[1]}
          break
        case "betequal": 
          split = data[0].split("::")
          result[key] = {$gte: split[0], $lte: split[1]}
          break
      }
    }
  }
  return result
}

exports.sort = (params) => {
  const splitData = params.split(",")
  let result = {}
  splitData.forEach(value => {
    if(value.charAt(0) == "-"){
      result[value.substring(1)] = -1
    } else {
      result[value] = 1
    }
  })
  return result
}