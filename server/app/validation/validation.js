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
    .withMessage("your password should have at least one alphabet")
  // .matches(/^[A-Za-z0-9 .,'!&]+$/, "g")
  // .withMessage("Password must contain letters, numbers and special characters")
}
