var path = require("path")

const mysql = require("mysql")
const config = require("dotenv")
config.config({ path: path.join(__dirname, "..", "..", "config.env") })

// creating a connection to our nodelogin database
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

// opening the connection with MYSQL database
connection.connect(function (error) {
  if (error) {
    throw error
  } else {
    console.log("Successfully connected to the database")
  }
})

// connection open and ready to be used outside of db.js
module.exports = connection
