const { check } = require("express-validator")
const db = require("../models/dbcon")

// function used to validate if username exists in database
function isUsernameInUse(username) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM accounts WHERE username = ?`
    db.query(sql, [username], (err, result) => {
      if (!err) {
        return resolve(result[0].total > 0)
      } else {
        return reject(new Error("Database Error"))
      }
    })
  })
}

function isGroupnameInUse(groupname) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM nodelogin.groups WHERE LOWER(groupname) = ?`
    db.query(sql, [groupname], (err, result) => {
      if (!err) {
        return resolve(result[0].total > 0)
      } else {
        return reject(new Error("Database Error"))
      }
    })
  })
}

function isApplicationNameInUse(name) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM nodelogin.application WHERE LOWER(App_Acronym) = ?`
    db.query(sql, [name], (err, result) => {
      if (!err) {
        return resolve(result[0].total > 0)
      } else {
        return reject(new Error("Database Error"))
      }
    })
  })
}

module.exports = {
  validateEmail: check("email").trim().notEmpty().withMessage("You have to enter an Email Address").isEmail().withMessage("Invalid Email Address"),
  validateUsername: check("username")
    .trim()
    .notEmpty()
    .withMessage("You have to enter an username")
    .custom(async user => {
      const value = await isUsernameInUse(user)
      if (value) {
        throw new Error("Username is already in use")
      }
    })
    .withMessage("Username already in use"),
  validatePassword: check("password")
    .trim()
    .notEmpty()
    .withMessage("You have to enter a password")
    .isLength({ min: 8, max: 10 })
    .withMessage("Password must be between 8 to 10 characters long")
    .matches(/\d/)
    .withMessage("your password should have at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("your password should have at least one sepcial character")
    .matches(/[a-zA-Z]/)
    .withMessage("your password should have at least one alphabet"),

  validateGroupname: check("groupname")
    .trim()
    .notEmpty()
    .withMessage("You have to enter a unique name")
    .custom(async groupname => {
      const value = await isGroupnameInUse(groupname)
      if (value) {
        throw new Error("Groupname is already in use")
      }
    })
    .withMessage("Groupname already in use"),

  validateApplicationName: check("name")
    .trim()
    .notEmpty()
    .withMessage("You have to enter a unique application name")
    .custom(async name => {
      const value = await isApplicationNameInUse(name)
      if (value) {
        throw new Error("Application name is already in use")
      }
    })
    .withMessage("Application name is already in use")
}
