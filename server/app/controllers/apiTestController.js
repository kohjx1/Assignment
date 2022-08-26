const db = require("../connections/dbcon")
var path = require("path")
const config = require("dotenv")
const e = require("express")
config.config({ path: path.join(__dirname, "..", "..", "config.env") })
const bcrypt = require("bcrypt")

// CreateTask
exports.CreateTask = (req, res) => {
  const { appname, password, username } = req.params
  const { taskname, description, notes } = req.body

  const tappname = appname.trim()
  const tpassword = password.trim()
  const tusername = username.trim()

  let usersql = `SELECT * FROM nodelogin.accounts WHERE username = ?`
  db.query(usersql, [tusername], async (err, result) => {
    if (result.length !== 0) {
      let dbpassword = result[0].password
      let isMatch = await bcrypt.compare(tpassword, dbpassword)
      if (!isMatch || result[0].status === 0) {
        // unauthoruzed access
        return res.status(401).json({
          success: false,
          code: 401,
          message: "Incorrect Credentials"
        })
      }

      let appsql = `SELECT * FROM nodelogin.application WHERE App_Acronym = ?`
      db.query(appsql, [tappname], (err, result) => {
        if (result.length !== 0) {
          const AppRnum = result[0].App_Rnumber

          let createGroups = result[0].App_permit_Create.split(",")
          let groupsql = `SELECT * FROM nodelogin.groups g WHERE g.groupname IN (`
          for (var i = 0; i < createGroups.length; i++) {
            groupsql += `"${createGroups[i]}"` + ","
          }
          groupsql = groupsql.substring(0, groupsql.length - 1)
          groupsql = groupsql + ") AND g.username = ?"

          if (taskname === undefined || taskname.trim() === "") {
            // bad request
            return res.status(400).json({
              success: false,
              code: 400,
              message: `Task name cannot be left empty or in white space`
            })
          } else {
            // add another query here to check if taskname already exists in current application
            let tasknamesql = "SELECT COUNT(*) AS `exist` FROM nodelogin.task WHERE `Task_app_Acronym` = ? AND `Task_name` = ?"
            db.query(tasknamesql, [tappname, taskname], (err, result) => {
              if (result[0].exist !== 0) {
                // taskname already exist in the app
                return res.status(400).json({
                  success: false,
                  code: 400,
                  message: `Task name: ${taskname} already exists in the application: ${tappname}`
                })
              } else {
                // taskname does not exist, allow to create
                db.query(groupsql, [tusername], (err, result) => {
                  if (result.length !== 0) {
                    let tasksql = "SELECT COUNT(*) AS `size` FROM nodelogin.task WHERE `Task_app_Acronym` = ?"
                    db.query(tasksql, [tappname], (err, result) => {
                      let numTask = result[0].size
                      const rNum = AppRnum + numTask
                      const taskID = `${tappname}` + "_" + `${rNum}`
                      console.log(taskID)

                      const state = "open"

                      var today = new Date()

                      var date = today.getFullYear() + "-" + (today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1) + "-" + (today.getDate() + 1 < 10 ? "0" + (today.getDate() + 1) : today.getDate() + 1)
                      if (today.getMinutes() < 10) {
                        var time = today.getHours() + ":0" + today.getMinutes() + ":" + today.getSeconds()
                      } else {
                        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
                      }
                      var datetime = date + " " + time
                      var auditNote = `Date: ${date}        Time: ${time}        User: ${tusername}        State: open`

                      if (notes && !description) {
                        var newNote = auditNote + `\r\nNotes: ${notes}\n\n`
                      } else if (!notes && description) {
                        var newNote = auditNote + `\r\nDescription: ${description}\n\n`
                      } else if (notes && description) {
                        var newNote = auditNote + `\r\nDescription: ${description}` + `\r\nNote: ${notes}\n\n`
                      } else {
                        var newNote = ""
                      }

                      let insertTaskSql = "INSERT INTO nodelogin.task SET `Task_name` = ?, `Task_Description` = ?, `Task_notes` = ?, `Task_id` = ?, `Task_app_Acronym` = ?, `Task_state` = ?, `Task_creator` = ?, `Task_owner` = ?, `Task_createDate` = ?"
                      db.query(insertTaskSql, [taskname, description, newNote, taskID, tappname, state, tusername, tusername, datetime], (err, result) => {
                        if (err) {
                          throw err
                        } else {
                          // creation success
                          return res.status(201).json({
                            success: true,
                            code: 201,
                            message: `Task Name: ${taskname} with Task ID: ${taskID}, has been created successfully under the ${tappname} application`
                          })
                        }
                      })
                    })
                  } else {
                    // forbidden request 403
                    return res.status(403).json({
                      success: false,
                      code: 403,
                      message: "User is not allowed access to create task in this application"
                    })
                  }
                })
              }
            })
          }
        } else {
          return res.status(404).json({
            success: false,
            code: 404,
            message: "Application not found"
          })
        }
      })
    } else {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Incorrect Credentials"
      })
    }
  })
}

//GetTaskbyState
exports.GetTaskbyState = (req, res) => {
  const { username, password, appname, taskstate } = req.params

  const tusername = username.trim()
  const tpassword = password.trim()
  const tappname = appname.trim()
  const ttaskstate = taskstate.trim().toLowerCase()

  let usersql = `SELECT * FROM nodelogin.accounts WHERE username = ?`
  db.query(usersql, [tusername], async (err, result) => {
    if (result.length !== 0) {
      let dbpassword = result[0].password
      let isMatch = await bcrypt.compare(tpassword, dbpassword)
      if (!isMatch || result[0].status === 0) {
        // unauthorized access
        return res.status(401).json({
          success: false,
          code: 401,
          message: "Incorrect Credentials"
        })
      } else {
        //check if part of application roles
        let appsql = `SELECT * FROM nodelogin.application WHERE App_Acronym = ?`
        db.query(appsql, [tappname], (err, result) => {
          if (result.length !== 0) {
            // check to see if part of any of permit roles
            // let create, open, todo, doing, done = result[0].app
            let create = result[0].App_permit_Create
            let open = result[0].App_permit_Open
            let todo = result[0].App_permit_toDoList
            let doing = result[0].App_permit_Doing
            let done = result[0].App_permit_Done
            appGrps = (create + "," + open + "," + todo + "," + doing + "," + done).split(",")

            console.log(appGrps)
            console.log(appGrps.includes("Team Member"))

            let groupsql = `SELECT * FROM nodelogin.groups g WHERE g.groupname IN (`
            for (var i = 0; i < appGrps.length; i++) {
              groupsql += `"${appGrps[i]}"` + ","
            }
            groupsql = groupsql.substring(0, groupsql.length - 1)
            groupsql = groupsql + ") AND g.username = ?"

            db.query(groupsql, [tusername], (err, result) => {
              if (result.length !== 0) {
                //allow this user to fetch the task information
                let taskinfo = `SELECT * FROM nodelogin.task WHERE Task_state = ? AND Task_app_Acronym = ?`
                db.query(taskinfo, [ttaskstate, tappname], (err, result) => {
                  if (result.length !== 0) {
                    // return tasks
                    return res.status(200).json({
                      success: true,
                      code: 200,
                      entries: result.length,
                      result: result
                    })
                  } else {
                    return res.status(404).json({
                      success: false,
                      code: 404,
                      message: `No tasks exists in the ${ttaskstate} state under ${tappname} application`
                    })
                  }
                })
              } else {
                // forbidden request 403
                return res.status(403).json({
                  success: false,
                  code: 403,
                  message: `${tusername} is not allowed access to access to the tasks in ${tappname}`
                })
              }
            })
          } else {
            return res.status(404).json({
              success: false,
              code: 404,
              message: "Application not found"
            })
          }
        })
      }
    } else {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Incorrect Credentials"
      })
    }
  })
}

//PromoteTask2Done
exports.PromoteTask2Done = (req, res) => {
  const { username, password, appname, taskID } = req.params

  const tusername = username.trim()
  const tpassword = password.trim()
  const tappname = appname.trim()
  const ttaskID = taskID.trim()
}
