import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Grid, Paper, Avatar, TextField, Button } from "@mui/material"
import KeyIcon from "@mui/icons-material/Key"
import Axios from "axios"

function Register() {
  const paperStyle = { padding: 20, height: "80vh", width: 280, margin: "20px auto" }
  const avatarStyle = { background: "green" }
  const inputStyle = { height: 80 }
  let navi = useNavigate

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  async function addUser(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("http://localhost:8080/signup", { username: username, email: email, password: password })

      console.log(response.data)
    } catch (e) {
      console.log("There was a problem")
    }
  }

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <KeyIcon />
          </Avatar>
          <h2>Sign Up Page</h2>
        </Grid>
        <TextField
          label="Email"
          placeholder="Enter Email"
          style={inputStyle}
          fullWidth
          required
          onChange={e => {
            setEmail(e.target.value)
          }}
        />
        <TextField
          label="Username"
          placeholder="Enter Username"
          style={inputStyle}
          fullWidth
          required
          onChange={e => {
            setUsername(e.target.value)
          }}
        />
        <TextField
          label="Password"
          placeholder="Enter Password"
          style={inputStyle}
          type="password"
          fullWidth
          required
          onChange={e => {
            setPassword(e.target.value)
          }}
        />
        <Button type="submit" color="primary" variant="contained" fullWidth onClick={addUser}>
          Sign Up
        </Button>
      </Paper>
    </Grid>
  )
}

export default Register
