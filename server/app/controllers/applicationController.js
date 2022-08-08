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
