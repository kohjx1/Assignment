var path = require("path")
const nodemailer = require("nodemailer")

const config = require("dotenv")
config.config({ path: path.join(__dirname, "..", "..", "config.env") })

const transport = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.FROMEMAIL,
    pass: process.env.FROMEMAILPW
  }
})

transport.verify((err, success) => {
  if (err) {
    console.log(err)
  } else {
    console.log("ready to send email")
  }
})

module.exports = transport
