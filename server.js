const express = require("express")
const routes = require('./routes')
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', routes)
// Undefined Routes
app.use('*', (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist'
  })
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});