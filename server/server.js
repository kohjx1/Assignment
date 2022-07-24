const user = require("./app/routes/userRoutes")
const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors())

// to parse requests of content-type - application/json
app.use(express.json())

app.use("/", user)

//set port, listen for requests
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
