const db = require("../connections/dbcon")
var path = require("path")
const { validationResult, check } = require("express-validator")
const config = require("dotenv")
config.config({ path: path.join(__dirname, "..", "..", "config.env") })
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const e = require("express")
// bcrypt parameters
const salt = 10

exports.bulkUpdateEmail = (req, res) => {
  const { ids, email } = req.body
  console.log(ids, email)

  const errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    let sql = `UPDATE nodelogin.accounts SET email = ? where id in (`
    for (var i = 0; i < ids.length; i++) {
      sql = sql + `${ids[i]},`
    }
    sql = sql.substring(0, sql.length - 1)
    sql = sql + ")"

    db.query(sql, [email], (err, result) => {
      if (err) {
        throw err
      } else {
        console.log("Successfully Bulk updated user's email")
        res.send("Successfully Bulk updated user's email")
        return
      }
    })
  }
}

exports.bulkUpdatePassword = async (req, res) => {
  const { ids, password } = req.body
  console.log(ids, password)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    let hashedPassword = await bcrypt.hash(password, salt)
    let sql = `UPDATE nodelogin.accounts SET password = ? where id in (`
    for (var i = 0; i < ids.length; i++) {
      sql = sql + `${ids[i]},`
    }
    sql = sql.substring(0, sql.length - 1)
    sql = sql + ")"

    db.query(sql, [hashedPassword], (err, result) => {
      if (err) {
        throw err
      } else {
        console.log("Successfully Bulk updated user's Password")
        res.send("Successfully Bulk updated user's Password")
        return
      }
    })
  }
}

exports.bulkUpdateStatus = (req, res) => {
  const { ids, status } = req.body
  console.log(ids, status)

  let sql = `UPDATE nodelogin.accounts SET status = ? where id in (`
  for (var i = 0; i < ids.length; i++) {
    sql = sql + `${ids[i]},`
  }
  sql = sql.substring(0, sql.length - 1)
  sql = sql + ")"

  db.query(sql, status, (err, result) => {
    if (err) {
      throw err
    } else {
      console.log("Successfully Bulk updated user's Status")
      res.send("Successfully Bulk updated user's Status")
      return
    }
  })
}

exports.bulkUpdateEmailPassword = async (req, res) => {
  const { ids, email, password } = req.body
  console.log(ids, email, password)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    let hashedPassword = await bcrypt.hash(password, salt)
    let sql = `UPDATE nodelogin.accounts SET email = ? ,password = ? where id in (`
    for (var i = 0; i < ids.length; i++) {
      sql = sql + `${ids[i]},`
    }
    sql = sql.substring(0, sql.length - 1)
    sql = sql + ")"

    db.query(sql, [email, hashedPassword], (err, result) => {
      if (err) {
        throw err
      } else {
        console.log("Successfully Bulk updated user's Email and Password")
        res.send("Successfully Bulk updated user's Email and Password")
        return
      }
    })
  }
}

exports.bulkUpdatePasswordStatus = async (req, res) => {
  const { ids, password, status } = req.body
  console.log(ids, password, status)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    let hashedPassword = await bcrypt.hash(password, salt)
    let sql = `UPDATE nodelogin.accounts SET password = ?, status = ? where id in (`
    for (var i = 0; i < ids.length; i++) {
      sql = sql + `${ids[i]},`
    }
    sql = sql.substring(0, sql.length - 1)
    sql = sql + ")"

    db.query(sql, [hashedPassword, status], (err, result) => {
      if (err) {
        throw err
      } else {
        console.log("Successfully Bulk updated user's Status and Password")
        res.send("Successfully Bulk updated user's Status and Password")
        return
      }
    })
  }
}

exports.bulkUpdateEmailStatus = async (req, res) => {
  const { ids, email, status } = req.body
  console.log(ids, email, status)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    let sql = `UPDATE nodelogin.accounts SET email = ?, status = ? where id in (`
    for (var i = 0; i < ids.length; i++) {
      sql = sql + `${ids[i]},`
    }
    sql = sql.substring(0, sql.length - 1)
    sql = sql + ")"

    db.query(sql, [email, status], (err, result) => {
      if (err) {
        throw err
      } else {
        console.log("Successfully Bulk updated user's Status and Email")
        res.send("Successfully Bulk updated user's Status and Email")
        return
      }
    })
  }
}

exports.bulkUpdateEmailPasswordStatus = async (req, res) => {
  const { ids, email, password, status } = req.body
  console.log(ids, email, password, status)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    let hashedPassword = await bcrypt.hash(password, salt)
    let sql = `UPDATE nodelogin.accounts SET email = ? ,password = ? , status = ? where id in (`
    for (var i = 0; i < ids.length; i++) {
      sql = sql + `${ids[i]},`
    }
    sql = sql.substring(0, sql.length - 1)
    sql = sql + ")"

    db.query(sql, [email, hashedPassword, status], (err, result) => {
      if (err) {
        throw err
      } else {
        console.log("Successfully Bulk updated user's Password")
        res.send("Successfully Bulk updated user's Password")
        return
      }
    })
  }
}
