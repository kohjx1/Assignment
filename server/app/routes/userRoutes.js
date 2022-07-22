// When client sends request, need to determine how server will respond
const { signup, findAll, findOne, update } = require("../controllers/userController")

const express = require("express")
const router = express.Router()

router.route("/signup").post(signup)
router.route("/users").get(findAll)
router.route("/:username").get(findOne)
router.route("/update/:username").put(update)

module.exports = router
