const mysql = require("mysql");
const mongoose = require('mongoose');
let connection = null
// // Create a connection to the database
// connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "oke",
//   database: "latihan"
// });

// // open the MySQL connection
// connection.connect(error => {
//   if (error) return console.log(error)
//   console.log("Successfully connected to the database.");
// });

// mongo
mongoose.set('debug', true);
mongoose.Promise = global.Promise;
const database = `mongodb://localhost:27017/latihan`

connection = mongoose.connect(database, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  // user: process.env.DATABASE_USERNAME, // IMPORTANT TO HAVE IT HERE AND NOT IN CONNECTION STRING
  // pass: process.env.DATABASE_PASSWORD, // IMPORTANT TO HAVE IT HERE AND NOT IN CONNECTION STRING
  // dbName: process.env.DATABASE_NAME,
}).then(con => {
  console.log('DB connection Successfully!');
}).catch(err => {
  console.log("Cannot connect to the database!", err);
  process.exit();
});

module.exports = connection;