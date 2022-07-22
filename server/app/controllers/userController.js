const db = require("../models/dbcon")

// Create new account
exports.signup = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    })
  }
  const user = req.body.username
  const email = req.body.email
  const pass = req.body.password
  let sql = "INSERT INTO accounts SET username = ?, email = ?, password = ? "
  db.query(sql, [user, email, pass], (err, result) => {
    if (err) throw err
    console.log("User Data Created Successfully")
    res.send(result)
    return
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
