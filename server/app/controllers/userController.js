const db = require("../models/dbcon")
const { validationResult } = require("express-validator")

var path = require("path")
const config = require("dotenv")
config.config({ path: path.join(__dirname, "..", "..", "config.env") })
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

// bcrypt parameters
const salt = 10

// Create new account
exports.create = async (req, res) => {
  const { username, email, password } = req.body

  const errors = validationResult(req)

  // validation errors will automatically respond on frontend form
  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    // Create new data in database
    let hashedPassword = await bcrypt.hash(password, salt)
    // console.log(hashedPassword)
    let sql = "INSERT INTO accounts SET username = ?, email = ?, password = ? "
    db.query(sql, [username, email, hashedPassword], async (err, result) => {
      if (err) {
        throw err
      } else {
        const token = await JWT.sign(
          {
            username
          },
          process.env.JWTTOKEN
        )
        res.json({ token })
        console.log("User Data Created Successfully")
      }
    })
  }
}

// Authenticate Users
exports.auth = (req, res) => {
  // User logins with username and password

  const { username, password } = req.body
  // check database to see if user exists
  let sql = `SELECT * FROM accounts WHERE username = ?`
  db.query(sql, [username], async (err, result) => {
    if (result.length === 0) {
      return res.json({ errors: [{ msg: "Username or Password is Incorrect" }] })
    } else {
      const dbpassword = result[0].password
      const dbusername = result[0].username
      // if username exists in database

      let isMatch = await bcrypt.compare(password, dbpassword)

      if (!isMatch) {
        return res.json({ errors: [{ msg: "Username or Password is Incorrect" }] })
      }
      // if passwords match, authenticate
      let token = JWT.sign(
        {
          username
        },
        process.env.JWTTOKEN
      )
      res.json({ token: token, username: dbusername })
    }
  })
}

exports.userUpdate = async (req, res) => {
  console.log(req.body)
  const { username, email, password } = req.body

  const errors = validationResult(req)

  // validation errors will automatically respond on frontend form
  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    // Create new data in database
    let hashedPassword = await bcrypt.hash(password, salt)
    let sql = `UPDATE accounts SET email = ?, password = ? WHERE username = ?`
    db.query(sql, [email, hashedPassword, username], (err, result) => {
      if (err) {
        throw err
      } else {
        const token = JWT.sign(
          {
            username
          },
          process.env.JWTTOKEN
        )
        // send new token, remove old token, set new token as state token
        res.json({ token })

        console.log("User Data Updated Successfully")
      }
    })
  }
}

exports.checkGroup = (req, res) => {
  // Init values from the front end
  const { username, groupname } = req.body

  let sql = `Select * FROM nodelogin.groups Where username = ?`
  db.query(sql, [username], (err, result) => {
    if (err) throw err

    if (result[0].groupname === groupname) {
      return res.json({ inGroup: true })
    } else {
      return res.json({ inGroup: false })
    }
  })
}

// Looking up all users
exports.findAll = function (req, res) {
  let sql = "SELECT * FROM accounts"
  db.query(sql, (err, result) => {
    if (err) throw err
    console.log("Users Fetched Successfully")
    res.send(result)
    return
  })
}

// Looking up specific user only
exports.findOne = function (req, res) {
  if (!req.params) {
    res.status(400).send({
      message: "Please Enter a username before submitting request"
    })
  }
  const user = req.params.username
  if (user) {
    let sql = `SELECT * FROM accounts WHERE username = '${user}'`
    db.query(sql, (err, result) => {
      if (err) throw err
      console.log("Found User Data Successfully")
      res.send(result)
      return
    })
  }
}

// // Update user details
// exports.update = function (req, res) {
//   if (!req.body) {
//     res.status(400).send({
//       message: "Content cannot be empty"
//     })
//   }
//   const user = req.params.username
//   const email = req.body.email
//   const password = req.body.password
//   let sql = `UPDATE accounts SET email = ?, password = ? WHERE username =?`
//   db.query(sql, [email, password, user], (err, result) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         result.status(404).send({
//           message: `Not found Account with username ${user}.`
//         })
//       } else {
//         result.status(500).send({
//           message: "Error updating Account with username " + user
//         })
//       }
//     } else {
//       console.log("Updated User Details Successfully")
//       res.send(result)
//     }
//   })
// }
