const { CreateTask, GetTaskbyState, PromoteTask2Done } = require("../controllers/apiTestController")

const express = require("express")
const router = express.Router()

// CreateTask
router.route("/CreateTask/:username/:password/:appname").post(CreateTask)

// GetTaskbyState
router.route("/GetTaskbyState/:username/:password/:appname/:taskstate").get(GetTaskbyState)

// PromoteTask2Done
router.route("/PromoteTask2Done/:username/:password/:appname/:taskID").post(PromoteTask2Done)

module.exports = router
