const db = require("../models/dbcon")
const { validationResult, check } = require("express-validator")
var path = require("path")
const config = require("dotenv")
config.config({ path: path.join(__dirname, "..", "..", "config.env") })

// create new application (PL)
exports.createApp = (req, res) => {
  const { name, description, projectLead, projectManager, teamMember } = req.body
  console.log(name)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    let sql = `INSERT INTO nodelogin.application SET App_Acronym = "${name}", App_Description = "${description}", App_permit_Create = "${projectLead}", App_permit_Open = "${projectManager}", App_permit_toDoList = "${teamMember}", App_permit_Doing = "${teamMember}", App_permit_Done ="${projectLead}"`
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
  var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  if (today.getMinutes() < 10) {
    var time = today.getHours() + ":0" + today.getMinutes() + ":" + today.getSeconds()
  } else {
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  }
  var datetime = date + " " + time

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
