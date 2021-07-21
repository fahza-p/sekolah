exports.generatePagination = (query, sort, nextKey) => {
  const sortField = Object.keys(sort).length == 0 ? null : Object.keys(sort)
  console.log(sortField)

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

exports.filter = (comparation) => {
  switch (comparation) {
    case "like": return 
    case "start": return 
    case "end": return 
    case "=": return 
    case "!=": return 
  }
}