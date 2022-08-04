// When client sends request, need to determine how server will respond
const { updateEmail, updatePassword, create, auth, findAll, findOne, adminUpdateUser, getUsers, emailPassUpdate } = require("../controllers/userController")
const { checkGroup, createGroup, viewGroup, groupInsertUsers, groupDeleteUsers } = require("../controllers/groupController")
const { bulkUpdateEmail, bulkUpdatePassword, bulkUpdateStatus, bulkUpdateEmailPassword, bulkUpdatePasswordStatus, bulkUpdateEmailStatus, bulkUpdateEmailPasswordStatus } = require("../controllers/bulkEditController")
const { validateEmail, validateUsername, validatePassword, validateGroupname } = require("../validation/validation")

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
router.route("/users").get(findAll)
router.route("/updateUser").post([validatePassword], adminUpdateUser)
router.route("/createGroup").post([validateGroupname], createGroup)
router.route("/getGroups").get(viewGroup)
router.route("/getUsersOnly").post(getUsers)
router.route("/updateGroupsForUser").post(groupInsertUsers)
router.route("/removeGroupsFromUser").post(groupDeleteUsers)

router.route("/bulkUpdateEmail").post([validateEmail], bulkUpdateEmail)
router.route("/bulkUpdatePassword").post([validatePassword], bulkUpdatePassword)
router.route("/bulkUpdateStatus").post(bulkUpdateStatus)

router.route("/bulkUpdateEmailPassword").post([validateEmail, validatePassword], bulkUpdateEmailPassword)
router.route("/bulkUpdatePasswordStatus").post([validatePassword], bulkUpdatePasswordStatus)
router.route("/bulkUpdateEmailStatus").post([validateEmail], bulkUpdateEmailStatus)

router.route("/bulkUpdateEmailPasswordStatus").post([validateEmail, validatePassword], bulkUpdateEmailPasswordStatus)
// Pending

// Incomplete Connection
router.route("/:username").get(findOne)

// router.route("/update/:username").put(updateall)

module.exports = router
