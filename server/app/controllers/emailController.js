const transporter = require("../connections/emailcon")

var path = require("path")
const config = require("dotenv")
config.config({ path: path.join(__dirname, "..", "..", "config.env") })

exports.sendEmail = async (req, res) => {
  const { taskID, taskName, taskOwner, taskAppName, taskPlan } = req.body
  try {
    let info = await transporter.sendMail({
      from: process.env.FROMEMAIL,
      to: process.env.TOEMAIL,
      subject: `New Task Pushed to Done from Doing by ${taskOwner}`,
      html: `<p>Task: ${taskName}</p>
      <p>App: ${taskAppName}</p>
      <p>Plan: ${taskPlan}</p>
      <p>ID: ${taskID}</p>
      <p>Owner: ${taskOwner}</p>`
    })
    res.send("Successfully sent email")
  } catch (e) {
    console.log(e)
  }
}
