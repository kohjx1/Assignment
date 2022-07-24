import React, { useState } from "react"
import { Grid, Paper, Avatar, TextField, Button } from "@mui/material"
import KeyIcon from "@mui/icons-material/Key"
import { Link } from "react-router-dom"
import Axios from "axios"
// import { useNavigate } from "react-router-dom"

function login() {
  const paperStyle = { padding: 10, height: "80vh", width: 280, margin: "20px auto" }
  const avatarStyle = { background: "green" }
  const inputStyle = { height: 80 }

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setErrors] = useState("")

  async function login(e) {
    e.preventDefault()
    try {
      const response = await Axios.get("http://localhost:8080/login", { username: username, password: password })

      const err = response.data.errors
      if (err) {
        setErrors(err)
      } else {
        // setSuccess(true)
        // handleClickSuccess()
      }

      return
    } catch (e) {
      console.log(e)
      return
    }
  }

  // function for capturing validation error message from backend
  const getError = (errors, prop) => {
    try {
      return errors.filter(e => e.param === prop)[0].msg
    } catch (error) {
      return ""
    }
  }

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <KeyIcon />
          </Avatar>
          <h2>Log In</h2>
        </Grid>
        <TextField
          label="Username"
          placeholder="Enter Username"
          style={inputStyle}
          fullWidth
          required
          onChange={e => {
            setUsername(e.target.value)
          }}
          error={getError(error, "username") ? true : false}
          helperText={getError(error, "username")}
        />
        <h2></h2>
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
          error={getError(error, "password") ? true : false}
          helperText={getError(error, "password")}
        />
        <h2></h2>
        <Button type="submit" color="primary" variant="contained" fullWidth onClick={login}>
          Sign In
        </Button>
        <Link to="/Signup">Sign up</Link>
      </Paper>
    </Grid>
  )
}

export default login
