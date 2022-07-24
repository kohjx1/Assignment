const db = require("../models/dbcon")
const { validationResult } = require("express-validator")

// Create new account
exports.create = (req, res) => {
  // if (!req.body) {
  //   res.status(400).send({
  //     message: "Content can not be empty!"
  //   })
  // }

  const { username, email, password } = req.body

  const errors = validationResult(req)

  // validation errors will automatically respond on frontend form
  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    // Create new data in database
    let sql2 = "INSERT INTO accounts SET username = ?, email = ?, password = ? "
    db.query(sql2, [username, email, password], (err2, result2) => {
      if (err2) throw err2
      console.log("User Data Created Successfully")
      res.send(result2)
      return
    })
  }
}

exports.auth = (req, res) => {
  const { username, password } = req.body

  const errors = validationResult(req)
  console.log(errors)
  // validation errors will automatically respond on frontend form
  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    // check database
    let sql = `SELECT * FROM accounts WHERE username = ?`
    db.query(sql, [username], (err, result) => {
      const dbpassword = result[0].password
      const dbusername = result[0].username
      // if username and password are the same
      if (dbpassword === password && dbusername === username) {
        res.send("User Authenticated")
      } else {
        // if not same send error message
        res.status(400).send({
          errors: [{ param: "auth", msg: "Username or Password is Incorrect" }]
        })
      }
    })
  }
  // validate if user doesn't already exist in database
  // let sql = `SELECT * FROM accounts WHERE username = ?`
  // db.query(sql, [username], (err, result) => {
  //   // no username of this kind exists
  //   if (result.length === 0) {
  //     res.status(400).send({
  //       param: "auth",
  //       msg: "Username or Password is Incorrect"
  //     })
  //   }
  //   const dbpassword = result[0].password
  //   const dbusername = result[0].username
  //   // if username and password are the same
  //   if (dbpassword === password && dbusername === username) {
  //     res.send("User Authenticated")
  //   } else {
  //     // if not same send error message
  //     res.status(400).send({
  //       param: "auth",
  //       msg: "Username or Password is Incorrect"
  //     })
  //   }
  // })
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

// Update user details
exports.update = function (req, res) {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty"
    })
  }
  const user = req.params.username
  const email = req.body.email
  const password = req.body.password
  let sql = `UPDATE accounts SET email = ?, password = ? WHERE username =?`
  db.query(sql, [email, password, user], (err, result) => {
    if (err) {
      if (err.kind === "not_found") {
        result.status(404).send({
          message: `Not found Account with username ${user}.`
        })
      } else {
        result.status(500).send({
          message: "Error updating Account with username " + user
        })
      }
    } else {
      console.log("Updated User Details Successfully")
      res.send(result)
    }
  })
}
