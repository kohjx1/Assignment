import React from "react"
import { Grid, Paper, Avatar, TextField, Button } from "@mui/material"
import KeyIcon from "@mui/icons-material/Key"
import { useNavigate } from "react-router-dom"

function login() {
  const paperStyle = { padding: 20, height: "80vh", width: 280, margin: "20px auto" }
  const avatarStyle = { background: "green" }
  const inputStyle = { height: 80 }

  let navigate = useNavigate()

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <KeyIcon />
          </Avatar>
          <h2>Sign In Page</h2>
        </Grid>
        <TextField label="Username" placeholder="Enter Username" style={inputStyle} fullWidth required />
        <TextField label="Password" placeholder="Enter Password" style={inputStyle} type="password" fullWidth required />
        <Button type="submit" color="primary" variant="contained" fullWidth>
          Sign In
        </Button>
        <Button
          onClick={() => {
            navigate("/Signup")
          }}
          type="submit"
          color="primary"
          variant="contained"
          fullWidth
        >
          Sign Up
        </Button>
      </Paper>
    </Grid>
  )
}

export default login
