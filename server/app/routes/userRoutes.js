// When client sends request, need to determine how server will respond
const { create, auth, checkGroup, findAll, findOne, userUpdate } = require("../controllers/userController")

const { validateEmail, validateUsername, validatePassword } = require("../validation/validation")

const express = require("express")
const router = express.Router()

// Created Connection
router.route("/createUser").post([validateEmail, validatePassword, validateUsername], create)
router.route("/update").post([validateEmail, validatePassword], userUpdate)
router.route("/login").post(auth)
router.route("/checkGroup").post(checkGroup)
// Pending

// Incomplete Connection
router.route("/users").get(findAll)
router.route("/:username").get(findOne)

// router.route("/update/:username").put(updateall)

module.exports = router
