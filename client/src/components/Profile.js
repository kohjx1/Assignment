import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Grid, Paper, Avatar, TextField, Button, Alert, Collapse } from "@mui/material"
import KeyIcon from "@mui/icons-material/Key"
import { Link } from "react-router-dom"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function Profile() {
  const paperStyle = { padding: 10, height: "65vh", width: 400, margin: "20px auto" }
  const avatarStyle = { background: "#94128a" }
  const inputStyle = { height: 80 }
  const navigate = useNavigate()
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  // using global username
  const currentUser = appState.user.username
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setErrors] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccess(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [success])

  const handleClickSuccess = () => {
    setEmail("")
    setPassword("")
    setErrors("")
  }

  async function updateCredentials(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("http://localhost:8080/update/:username", { username: currentUser, email: email, password: password })

      const err = response.data.errors
      if (err) {
        setErrors(err)
      } else {
        setSuccess(true)
        handleClickSuccess()
        appDispatch({ type: "newToken", data: response.token })
        handleClickSuccess
      }
      return
    } catch (e) {
      console.log("There was a problem")
      return
    }
  }

  const getError = (errors, prop) => {
    try {
      return errors.filter(e => e.param === prop)[0].msg
    } catch (error) {
      return ""
    }
  }

  return (
    <Grid>
      <Collapse in={success}>
        <Alert severity="success">Credentials Changed Successfully</Alert>
      </Collapse>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <KeyIcon />
          </Avatar>
          <h2>Update Credentials</h2>
        </Grid>
        <h2></h2>
        <TextField
          label="Email"
          placeholder="Enter New Email"
          style={inputStyle}
          type="password"
          fullWidth
          onChange={e => {
            setEmail(e.target.value)
          }}
          error={getError(error, "email") ? true : false}
          helperText={getError(error, "email")}
        />
        <h2></h2>
        <TextField
          label="Password"
          placeholder="Enter New Password"
          style={inputStyle}
          type="password"
          fullWidth
          onChange={e => {
            setPassword(e.target.value)
          }}
          error={getError(error, "password") ? true : false}
          helperText={getError(error, "password")}
        />
        <br></br>
        <br></br>
        <br></br>
        <Button type="submit" color="primary" variant="contained" fullWidth onClick={updateCredentials}>
          Update
        </Button>
        {/* <Link to="/Signup">Sign up</Link> */}
      </Paper>
    </Grid>
  )
  // onClick={login}
}

export default Profile
