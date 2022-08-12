const db = require("../models/dbcon")
var path = require("path")
const { validationResult, check } = require("express-validator")
const config = require("dotenv")
config.config({ path: path.join(__dirname, "..", "..", "config.env") })
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
// bcrypt parameters
const salt = 10

// Check if user belongs to particular group
exports.checkGroup = (req, res) => {
  // Init values from the front end
  const { username, groupname } = req.body
  console.log(username, groupname)
  let sql = `SELECT IF(  EXISTS(SELECT * FROM nodelogin.groups  WHERE LOWER(username) = ? and LOWER(groupname) = ? ),'true','false' )AS result`
  db.query(sql, [username, groupname], (err, result) => {
    if (err) {
      throw err
    } else {
      output = result[0].result
      if (output === "true") {
        return res.json({ inGroup: true })
      } else if (output === "false") {
        return res.json({ inGroup: false })
      }
      return
    }
  })
}

exports.getDistinctGroups = (req, res) => {
  let sql = "SELECT DISTINCT `groupname` from nodelogin.groups"
  db.query(sql, (err, result) => {
    if (err) {
      throw err
    } else {
      res.send(result)
    }
  })
}

// Creating new group
exports.createGroup = async (req, res) => {
  const { groupname } = req.body
  // const username = sessionStorage.getItem("username")
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.send(errors)
  } else {
    let sql = "INSERT INTO nodelogin.groups SET username = ?, groupname = ?"
    db.query(sql, ["", groupname], async (err, result) => {
      if (err) {
        throw err
      } else {
        res.json({ groupname: groupname })
        console.log("User Data Created Successfully")
      }
    })
  }
}

exports.viewGroup = async (req, res) => {
  try {
    let sql = "SELECT * FROM nodelogin.groups"
    db.query(sql, async (err, result) => {
      if (err) {
        throw err
      } else {
        res.send(result)
        console.log("Groups fetched")
      }
    })
  } catch (e) {
    console.log(e)
  }
}

exports.groupInsertUsers = (req, res) => {
  const { groupname, users } = req.body
  let sql = "INSERT INTO nodelogin.groups (`groupname`,`username`) VALUES"
  for (var i = 0; i < users.length; i++) {
    sql = sql + `("${groupname}", "${users[i]}"),`
  }
  sql = sql.substring(0, sql.length - 1)

  db.query(sql, (err, result) => {
    if (err) {
      throw err
    } else {
      console.log("Successfully updated user's new groups")
      res.send("Successfully updated user's new groups")
      return
    }
  })
}

exports.groupDeleteUsers = (req, res) => {
  const { groupname, users } = req.body
  let sql = "DELETE FROM nodelogin.groups WHERE (`groupname`,`username`) IN ("
  for (var i = 0; i < users.length; i++) {
    sql = sql + `("${groupname}", "${users[i]}"),`
  }

  sql = sql.substring(0, sql.length - 1) + ")"

  db.query(sql, (err, result) => {
    if (err) {
      throw err
    } else {
      console.log("Successfully removed user's previous groups")
      res.send("Successfully removed user's previous groups")
      return
    }
  })
}

exports.getOneUserGroupName = (req, res) => {
  const { username } = req.body
  console.log(username)
  let sql = "SELECT `groupname` FROM nodelogin.groups WHERE `username` in (?)"
  db.query(sql, username, (err, result) => {
    if (err) {
      console.log("no group")
      res.send([])
      // throw err
    } else {
      console.log("Successfully fetched userGroup")
      res.send(result)
      return
    }
  })
}
