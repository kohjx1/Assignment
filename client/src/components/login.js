import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Grid, Paper, Avatar, TextField, Button, Alert, Collapse } from "@mui/material"
import KeyIcon from "@mui/icons-material/Key"
import { Link } from "react-router-dom"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function login() {
  const paperStyle = { padding: 10, height: 450, width: 400, margin: "20px auto", top: "50%", left: "50%" }
  const avatarStyle = { background: "#94128a" }
  const inputStyle = { height: 80 }
  const navigate = useNavigate()
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setErrors] = useState("")
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)
  const [role, setRole] = useState("")
  // const [error, setErrors] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccess(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [success])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFail(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [fail])

  // async function getUserGroup(username, role) {
  //   const response = await Axios.post("http://localhost:8080/checkGroup", { username: username, groupname: role })
  //   if (response.data.inGroup === true) {
  //     return sessionStorage.setItem("role", "admin")
  //   } else if (response.data.inGroup === false) {
  //     return sessionStorage.setItem("role", "user")
  //   }
  //   return
  // }

  async function login(e) {
    // e.preventDefault()

    try {
      const response = await Axios.post("http://localhost:8080/login", { username: username, password: password })
      const responseAdmin = await Axios.post("http://localhost:8080/checkGroup", { username: username, groupname: "admin" })
      const responseGrp = await Axios.post("http://localhost:8080/getOneUserGroupName", { username: username })

      const data = response.data
      const isAdmin = responseAdmin.data.inGroup
      const groups = responseGrp.data

      console.log(data)
      console.log(isAdmin)
      console.log(groups)

      if (data.errors) {
        setErrors(data.errors[0].msg)
        setFail(true)
      } else {
        appDispatch({ type: "login", data: response.data })
        setSuccess(true)

        var grouping = []
        for (var i = 0; i < groups.length; i++) {
          grouping.push(groups[i].groupname)
        }
        console.log(grouping)
        if (isAdmin) {
          sessionStorage.setItem("role", "admin")

          sessionStorage.setItem("groups", grouping)
        } else {
          sessionStorage.setItem("role", "user")

          console.log(grouping)
          sessionStorage.setItem("groups", grouping)
        }
        navigate("/Home")
      }
      return
    } catch (e) {
      console.log(e)
      return
    }
  }

  return (
    <Grid>
      {
        <Collapse in={fail}>
          <Alert severity="warning">{error}</Alert>
        </Collapse>
      }

      <Collapse in={success}>
        <Alert severity="success">Log in Successfully</Alert>
      </Collapse>
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
          error={error ? true : false}
          // helperText={getError(error, "username")}
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
          error={error ? true : false}
          // helperText={getError(error, "password")}
        />
        <h2></h2>
        <Button type="submit" color="primary" variant="contained" fullWidth onClick={login}>
          Sign In
        </Button>
        {/* <Link to="/Signup">Sign up</Link> */}
      </Paper>
    </Grid>
  )
}

export default login
