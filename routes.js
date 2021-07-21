const app = require('express')
const router = app.Router()
const controllers = require('./Controller')
const auth = require("./Middleware/jwt")

router
  // Auth
  .post("/signin", controllers.auth.signin)
  .post("/signup", controllers.auth.signup)
  
  // User
  .get("/user",[auth.verifyToken] ,controllers.user.findAll)
  .post("/user/update",[auth.verifyToken] ,controllers.user.update)
  .get("/user/detail",[auth.verifyToken] ,controllers.user.findOne)
  .post("/user/delete",[auth.verifyToken] ,controllers.user.delete)
  
  // Customer
  .post("/customers", controllers.customer.create)
  .get("/customers", controllers.customer.findAll)
  .get("/customers/:customerId", controllers.customer.findOne)
  .put("/customers/:customerId", controllers.customer.update)
  .delete("/customers/:customerId", controllers.customer.delete)
  .delete("/customers", controllers.customer.deleteAll)

module.exports = router