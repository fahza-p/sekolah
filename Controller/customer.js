const sql = require('../Config/database')

// Create and Save a new Customer
exports.create = (req, result) => {
  // Validate request
  if (Object.keys(req.body).length == 0) {
    result.status(400).send({
      message: "Content can not be empty!"
    });
    return
  }

  // Create a Customer
  const customer = {
    email: req.body.email,
    name: req.body.name,
    active: req.body.active
  };

  sql.query("INSERT INTO customers SET ?", customer, (err, res) => {
    if (err) {
      result.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
      console.log("error: ", err);
      return;
    }

    console.log("created customer: ", { id: res.insertId, ...customer });
    result.status(200).send({ id: res.insertId, ...customer });
    return
  });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
  
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
  
};

// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
  
};

// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
  
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  
};