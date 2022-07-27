// When client sends request, need to determine how server will respond
const { create, auth, checkGroup, findAll, findOne, userUpdate, adminUpdateUser } = require("../controllers/userController")

const { validateEmail, validateUsername, validatePassword } = require("../validation/validation")

const express = require("express")
const router = express.Router()

// Created Connection
router.route("/createUser").post([validateEmail, validatePassword, validateUsername], create)
router.route("/update").post([validateEmail, validatePassword], userUpdate)
router.route("/login").post(auth)
router.route("/checkGroup").post(checkGroup)
router.route("/users").get(findAll)
router.route("/updateUser").post([validateEmail, validatePassword], adminUpdateUser)
// Pending

// Incomplete Connection
router.route("/:username").get(findOne)

// router.route("/update/:username").put(updateall)

module.exports = router
