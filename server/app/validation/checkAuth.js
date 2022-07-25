const JWT = require("jsonwebtoken")
var path = require("path")
const config = require("dotenv")
config.config({ path: path.join(__dirname, "..", "..", "config.env") })

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token")

  if (!token) {
    return res.status(400).json({
      errors: [
        {
          msg: "No Token Found"
        }
      ]
    })
  }

  try {
    let user = await JWT.verify(token, process.env.JWTTOKEN)
    req.user = user.username
    next()
  } catch (e) {
    return res.status(400).json({
      errors: [
        {
          msg: "Token Invalid"
        }
      ]
    })
  }
}
