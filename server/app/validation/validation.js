const { check } = require("express-validator")

module.exports = {
  validateEmail: check("email").trim().notEmpty().withMessage("You have to enter an Email Address").isEmail().withMessage("Invalid Email Address"),
  validateUsername: check("username").trim().notEmpty().withMessage("You have to enter an username"),
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
  // .matches(/^[A-Za-z0-9 .,'!&]+$/, "g")
  // .withMessage("Password must contain letters, numbers and special characters")
}
