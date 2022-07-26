const { check } = require("express-validator")
const db = require("../connections/dbcon")

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

function isPlanNameInUse(planname, appname) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM nodelogin.plan WHERE LOWER(Plan_MVP_name) = ? AND LOWER(Plan_app_Acronym) = ?`
    db.query(sql, [planname, appname], (err, result) => {
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

function isTaskNameInUse(app, taskname) {
  console.log(app, taskname)
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM nodelogin.task WHERE LOWER(Task_app_Acronym) = ? AND LOWER(Task_name) = ? `
    db.query(sql, [app, taskname], (err, result) => {
      if (!err) {
        return resolve(result[0].total > 0)
      } else {
        return reject(new Error("Database Error"))
      }
    })
  })
}

// function checkPlanDates(planname) {
//   console.log(planname)
//   return new Promise((resolve, reject) => {
//     var today = new Date()
//     var month = today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1
//     var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate()
//     var date = today.getFullYear() + "-" + month + "-" + day
//     let sql = `SELECT COUNT(*) AS total FROM nodelogin.plan WHERE LOWER(Plan_MVP_name) = ? and (Plan_startDate > ? or  Plan_endDate < ?)`
//     db.query(sql, [planname, date, date], (err, result) => {
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

  validatePlanName: check(["planname", "appname"])
    .trim()
    .notEmpty()
    .withMessage("You have to enter a unique plan name")
    .custom(async (e, appSelected) => {
      // console.log(planname)
      const planname = appSelected.req.body.planname
      const appname = appSelected.req.body.appname

      console.log("planname", planname)
      console.log("appname", appname)
      const value = await isPlanNameInUse(planname, appname)
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
    .withMessage("End date cannot be earlier than app start date or later than app end date"),

  validateTaskName: check(["name", "app"])
    .trim()
    .notEmpty()
    .withMessage("Please key in a unique task name")
    .custom(async (e, appSelected) => {
      // const { appname, startdate } = req.body
      console.log(appSelected.req.body)
      const app = appSelected.req.body.app
      const taskname = appSelected.req.body.name
      console.log("appname: ", app)
      console.log("taskname", taskname)
      const value = await isTaskNameInUse(app, taskname)
      console.log(value)
      if (value) {
        throw new Error("You have to enter a unique task name for each application")
      }
    })
    .withMessage("You have to enter a unique task name for each application"),

  validateAppStartDate: check(["startDate", "endDate"])
    .trim()
    .notEmpty()
    .withMessage("You need to initialize start date for Applications")
    .custom(async (e, appSelected) => {
      const start = appSelected.req.body.startDate
      const end = appSelected.req.body.endDate

      if (start > end) {
        throw new Error("Invalid Date selection")
      }
    })
    .withMessage("Invalid Date Selection")
}
