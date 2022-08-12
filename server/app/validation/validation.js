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

function isPlanNameInUse(planname) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM nodelogin.plan WHERE LOWER(Plan_MVP_name) = ?`
    db.query(sql, [planname], (err, result) => {
      if (!err) {
        return resolve(result[0].total > 0)
      } else {
        return reject(new Error("Database Error"))
      }
    })
  })
}

function planStartDate(appname, startdate) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM (SELECT App_Acronym, App_startDate, App_endDate FROM application WHERE App_Acronym = ?) as tmp WHERE App_startDate > ? or App_endDate < ? `
    db.query(sql, [appname, startdate, startdate], (err, result) => {
      if (!err) {
        return resolve(result[0].total > 0)
      } else {
        return reject(new Error("Database Error"))
      }
    })
  })
}

function planEndDate(appname, enddate, startdate) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM (SELECT App_Acronym, App_startDate, App_endDate FROM application WHERE App_Acronym = ?) as tmp WHERE App_startDate > ? or App_endDate < ? `
    db.query(sql, [appname, enddate, enddate], (err, result) => {
      if (!err) {
        return resolve(enddate < startdate ? true : result[0].total > 0 ? true : false)
      } else {
        return reject(new Error("Database Error"))
      }
    })
  })
}

// function isTaskNameInUse({ app, name }) {
//   console.log(app, name)
//   return new Promise((resolve, reject) => {
//     let sql = `SELECT COUNT(*) AS total FROM nodelogin.task WHERE LOWER(Task_app_Acronym) = ? AND LOWER(Task_name) = ? `
//     db.query(sql, [app, name], (err, result) => {
//       if (!err) {
//         return resolve(result[0].total > 0)
//       } else {
//         return reject(new Error("Database Error"))
//       }
//     })
//   })
// }

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
    .withMessage("Application name is already in use"),

  validatePlanName: check("planname")
    .trim()
    .notEmpty()
    .withMessage("You have to enter a unique plan name")
    .custom(async planname => {
      // console.log(planname)
      const value = await isPlanNameInUse(planname)
      // console.log(value)
      if (value) {
        throw new Error("Plan name is already in use")
      }
    })
    .withMessage("Plan name is already in use"),

  validateStartDate: check("startdate")
    .trim()
    .notEmpty()
    .withMessage("You have to enter a start date")
    .custom(async (e, appSelected) => {
      // const { appname, startdate } = req.body
      // console.log(startdate)
      // console.log(appSelected.req.body)
      const startdate = appSelected.req.body.startdate
      const appname = appSelected.req.body.appname
      console.log(startdate)
      console.log(appname)
      const value = await planStartDate(appname, startdate)
      // console.log(value)
      if (value) {
        throw new Error("Start date cannot be earlier than app start date or later than app end date")
      }
    })
    .withMessage("Start date cannot be earlier than app start date or later than app end date"),

  validateEndDate: check("enddate")
    .trim()
    .notEmpty()
    .withMessage("You have to enter an end date")
    .custom(async (e, appSelected) => {
      // const { appname, startdate } = req.body
      // console.log(startdate)
      // console.log(appSelected.req.body)
      const startdate = appSelected.req.body.startdate
      const enddate = appSelected.req.body.enddate
      const appname = appSelected.req.body.appname
      console.log(startdate)
      console.log(enddate)
      console.log(appname)
      const value = await planEndDate(appname, enddate, startdate)
      // console.log(value)
      if (value) {
        throw new Error("End date cannot be earlier than app start date or later than app end date")
      }
    })
    .withMessage("End date cannot be earlier than app start date or later than app end date")

  // validateTaskName: check("taskname")
  //   .custom(async (app, name) => {
  //     const value = await isTaskNameInUse(app, name)
  //     if (value) {
  //       throw new Error("Task name is already in use in this application")
  //     }
  //   })
  //   .withMessage("Task name is already in use in this application")
}
