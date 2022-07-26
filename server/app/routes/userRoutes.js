// When client sends request, need to determine how server will respond
const { create, auth, findAll, findOne, userUpdate } = require("../controllers/userController")

const { validateEmail, validateUsername, validatePassword } = require("../validation/validation")

const express = require("express")
const router = express.Router()

router.route("/createUser").post([validateEmail, validatePassword, validateUsername], create)
router.route("/update/:username").post([validateEmail, validatePassword], userUpdate)
router.route("/login").post(auth)
router.route("/users").get(findAll)
router.route("/:username").get(findOne)

// router.route("/update/:username").put(updateall)

module.exports = router
