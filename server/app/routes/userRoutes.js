// When client sends request, need to determine how server will respond
const { updateEmail, updatePassword, create, auth, findAll, findOne, adminUpdateUser, getUsers, emailPassUpdate } = require("../controllers/userController")
const { checkGroup, getDistinctGroups, createGroup, viewGroup, groupInsertUsers, groupDeleteUsers, getOneUserGroupName } = require("../controllers/groupController")
const { bulkUpdateEmail, bulkUpdatePassword, bulkUpdateStatus, bulkUpdateEmailPassword, bulkUpdatePasswordStatus, bulkUpdateEmailStatus, bulkUpdateEmailPasswordStatus } = require("../controllers/bulkEditController")
const { updateTransition, updateTask, assignPlan, createPlan, updateApplication, getSpecificAppDetails, updateStatus, countTaskPerApp, getTasks, createTask, createApp, getPlans, getApps, getTaskID } = require("../controllers/applicationController")
const { sendEmail } = require("../controllers/emailController")

const { validateAppStartDate, validateTaskName, validateEndDate, validateStartDate, validatePlanName, validateEmail, validateUsername, validatePassword, validateGroupname, validateApplicationName } = require("../validation/validation")

const express = require("express")
const router = express.Router()

// Created Connection
router.route("/createUser").post([validatePassword, validateUsername], create)
router.route("/updateEmailPass").post([validateEmail, validatePassword], emailPassUpdate)
router.route("/updateEmail").post([validateEmail], updateEmail)
router.route("/updatePassword").post([validatePassword], updatePassword)
// updateEmail
// updatePass

router.route("/login").post(auth)
router.route("/checkGroup").post(checkGroup)
router.route("/getDistinctGroups").get(getDistinctGroups)
router.route("/users").get(findAll)
router.route("/updateUser").post([validatePassword], adminUpdateUser)
router.route("/createGroup").post([validateGroupname], createGroup)
router.route("/getGroups").get(viewGroup)
router.route("/getUsersOnly").post(getUsers)
router.route("/updateGroupsForUser").post(groupInsertUsers)
router.route("/removeGroupsFromUser").post(groupDeleteUsers)
router.route("/getOneUserGroupName").post(getOneUserGroupName)
router.route("/getUserEmail").post(findOne)

router.route("/bulkUpdateEmail").post([validateEmail], bulkUpdateEmail)
router.route("/bulkUpdatePassword").post([validatePassword], bulkUpdatePassword)
router.route("/bulkUpdateStatus").post(bulkUpdateStatus)

router.route("/bulkUpdateEmailPassword").post([validateEmail, validatePassword], bulkUpdateEmailPassword)
router.route("/bulkUpdatePasswordStatus").post([validatePassword], bulkUpdatePasswordStatus)
router.route("/bulkUpdateEmailStatus").post([validateEmail], bulkUpdateEmailStatus)

router.route("/bulkUpdateEmailPasswordStatus").post([validateEmail, validatePassword], bulkUpdateEmailPasswordStatus)

router.route("/createApp").post([validateAppStartDate, validateApplicationName], createApp)
router.route("/getPlans").get(getPlans)
router.route("/getApps").get(getApps)
router.route("/getTaskID").post(getTaskID)
router.route("/createTask").post([validateTaskName], createTask)
router.route("/getTasks").get(getTasks)
router.route("/countTaskPerApp").post(countTaskPerApp)
router.route("/updateStatus").post(updateStatus)
router.route("/getSpecificAppDetails").post(getSpecificAppDetails)
router.route("/updateTransition").post(updateTransition)

// use for editing application data
router.route("/updateApplication").post([validateAppStartDate], updateApplication)

// check if plan name already exist for current app selected
router.route("/createPlan").post([validatePlanName, validateStartDate, validateEndDate], createPlan)

router.route("/assignPlan").post(assignPlan)
router.route("/updateTask").post(updateTask)

//email
router.route("/sendEmail").post(sendEmail)

// Pending

// Incomplete Connection

// router.route("/update/:username").put(updateall)

module.exports = router
