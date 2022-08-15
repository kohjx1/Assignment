const db = require("../models/dbcon")
const { validationResult, check } = require("express-validator")
var path = require("path")
const config = require("dotenv")
const e = require("express")
config.config({ path: path.join(__dirname, "..", "..", "config.env") })

// create new application (PL)
exports.createApp = (req, res) => {
  const { name, description, runningNumber, startDate, endDate, createState, openState, toDoState, doingState, doneState } = req.body
  console.log(name)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    let sql = `INSERT INTO nodelogin.application SET App_Acronym = "${name}", App_Description = "${description}", App_Rnumber = "${runningNumber}", App_startDate= "${startDate}", App_endDate = "${endDate}", App_permit_Create = "${createState}", App_permit_Open = "${openState}", App_permit_toDoList = "${toDoState}", App_permit_Doing = "${doingState}", App_permit_Done ="${doneState}"`
    db.query(sql, (err, result) => {
      if (err) {
        throw err
      } else {
        console.log("Successfully updated application configurations")
        res.send("Successfully updated application configurations")
      }
    })
  }
}

exports.getApps = (req, res) => {
  let sql = `SELECT * FROM nodelogin.application`
  db.query(sql, (err, result) => {
    if (err) {
      throw err
    } else {
      console.log("Successfully retrieved apps")
      res.send(result)
    }
  })
}

exports.getTaskID = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.send(errors)
  } else {
    const { name } = req.body
    let sql = "SELECT `App_Acronym`, `App_Rnumber` FROM nodelogin.application WHERE `App_Acronym` = ?"
    db.query(sql, [name], (err, result) => {
      if (err) {
        throw err
      } else {
        console.log("Retrieved taskID Successfully")
        res.send(result)
      }
    })
  }
}

exports.getPlans = (req, res) => {
  let sql = `SELECT * FROM nodelogin.plan`
  db.query(sql, (err, result) => {
    if (err) {
      throw err
    } else {
      console.log("Successfully retrieved plans")
      res.send(result)
    }
  })
}

exports.createTask = (req, res) => {
  const { name, description, notes, app, plan, creator, id } = req.body

  const state = "open"

  var today = new Date()

  var date = today.getFullYear() + "-" + (today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1) + "-" + (today.getDate() + 1 < 10 ? "0" + (today.getDate() + 1) : today.getDate() + 1)
  if (today.getMinutes() < 10) {
    var time = today.getHours() + ":0" + today.getMinutes() + ":" + today.getSeconds()
  } else {
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  }
  var datetime = date + " " + time

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.send(errors)
  } else {
    let sql = "INSERT INTO nodelogin.task SET `Task_name` = ?, `Task_Description` = ?, `Task_notes` = ?, `Task_id` = ?, `Task_plan` = ?, `Task_app_Acronym` = ?, `Task_state` = ?, `Task_creator` = ?, `Task_owner` = ?, `Task_createDate` = ?"
    db.query(sql, [name, description, notes, id, plan, app, state, creator, creator, datetime], (err, result) => {
      if (err) {
        throw err
      } else {
        console.log("Successfully created new task")
        res.send(result)
      }
    })
  }
}

exports.getTasks = (req, res) => {
  let sql = "SELECT * FROM nodelogin.task"
  db.query(sql, (err, results) => {
    if (err) {
      throw err
    } else {
      console.log("Retrieved all tasks successfully")
      res.send(results)
    }
  })
}

exports.countTaskPerApp = (req, res) => {
  const { appname } = req.body
  let sql = "SELECT COUNT(*) AS `size` FROM nodelogin.task WHERE `Task_app_Acronym` = ?"
  db.query(sql, [appname], (err, result) => {
    if (err) {
      throw err
    } else {
      console.log("Number of tasks found")
      res.send(result)
    }
  })
}

exports.updateStatus = (req, res) => {
  const { taskID, taskState } = req.body
  let sql = "UPDATE nodelogin.task SET `Task_state` = ? Where `Task_id` = ?"
  db.query(sql, [taskState, taskID], (err, result) => {
    if (err) {
      throw err
    } else {
      console.log("Successful in updating status")
      res.send("successful in updating status")
    }
  })
}

exports.getSpecificAppDetails = (req, res) => {
  const { appname } = req.body
  let sql = " SELECT * FROM nodelogin.application WHERE `App_Acronym` = ?"
  db.query(sql, [appname], (err, result) => {
    if (err) {
      throw err
    } else {
      console.log("Successfully retrieved app details")
      res.send(result)
    }
  })
}

exports.updateApplication = (req, res) => {
  const { appname, description, create, open, todo, doing, done, startdate, enddate } = req.body
  console.log(appname, description, create, open, todo, doing, done, startdate, enddate)
  let sql = "UPDATE nodelogin.application SET `App_Description` = ?, `App_permit_Create` = ?, `App_permit_Open` = ?, `App_permit_toDoList` = ?, `App_permit_Doing` = ?, `App_permit_Done` = ?, `App_startDate` = ?, `App_endDate` = ? WHERE `App_Acronym` = ?"
  db.query(sql, [description, `${create}`, `${open}`, `${todo}`, `${doing}`, `${done}`, startdate, enddate, appname], (err, result) => {
    if (err) {
      throw err
    } else {
      console.log("Successfully edited application data")
      res.send(result)
    }
  })
}

exports.createPlan = (req, res) => {
  const { planname, startdate, enddate, appname } = req.body

  const errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    let sql = "INSERT INTO nodelogin.plan SET `Plan_MVP_name` = ?, `Plan_startDate` = ?, `Plan_endDate` = ?, `Plan_app_Acronym` = ?"
    db.query(sql, [planname, startdate, enddate, appname], (err, result) => {
      if (err) {
        throw err
      } else {
        console.log("Successfully edited application data")
        res.send(result)
      }
    })
  }
}

exports.assignPlan = (req, res) => {
  const { taskID, plan } = req.body
  console.log(taskID, plan)
  let sql = "UPDATE nodelogin.task SET `Task_plan` = ? WHERE `Task_id` = ?"
  db.query(sql, [plan, taskID], (err, result) => {
    if (err) {
      throw err
    } else {
      console.log(`Successfully updated plan for task id: ${taskID} `)
      res.send(result)
    }
  })
}
