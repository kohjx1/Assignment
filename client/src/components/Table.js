import React, { useState, useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import Axios from "axios"
import Box from "@mui/material/Box"
import { DataGrid } from "@mui/x-data-grid"
import { TextField, Button, Grid, Alert, Collapse, AlertTitle, LinearProgress } from "@mui/material"

function Table() {
  // const appDispatch = useContext(DispatchContext)
  // const appState = useContext(StateContext)

  const gridStyles = { paddingLeft: 5 }
  const fontProps = { style: { fontSize: 17.5 }, sx: { height: 45 } }
  const buttonProps = { backgroundColor: "#94128a", "&:hover": { backgroundColor: "#333" } }

  const [data, setData] = useState("")
  const [error, setErrors] = useState("")
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorCreate, setErrorsCreate] = useState("")
  const [successCreate, setSuccessCreate] = useState(false)
  const [failCreate, setFailCreate] = useState(false)
  const [selectionModel, setSelectionModel] = useState(temp)
  const [boo, setBoo] = useState(false)

  console.log(selectionModel)
  const handleClickSuccess = () => {
    setEmail("")
    setUsername("")
    setPassword("")
    setErrorsCreate("")
  }

  // collecting all user data on generate
  var rows = data
  // console.log(rows)
  // manipulate data to hide password
  var temp = []
  for (var i = 0; i < rows.length; i++) {
    temp.push({ ...rows[i], password: "**********" })
  }

  const columns = [
    { field: "id", headerName: "ID", type: "number", width: 90 },
    { field: "username", headerName: "Username", width: 150 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true
    },
    { field: "password", headerName: "Password", type: "string", width: 150, editable: true },
    { field: "status", headerName: "Status", type: "boolean", width: 150, editable: true }
  ]

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccess(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [success])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessCreate(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [successCreate])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFail(false)
      setErrors("")
    }, 1000)

    return () => clearTimeout(timeout)
  }, [fail])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFailCreate(false)
      setErrorsCreate("")
    }, 1500)

    return () => clearTimeout(timeout)
  }, [errorCreate])

  useEffect(() => {
    getData()
  }, [])

  async function addUser(e) {
    // e.preventDefault()
    try {
      const response = await Axios.post("http://localhost:8080/createUser", { username: username, email: email, password: password })

      const err = response.data.errors
      if (err) {
        setErrorsCreate(err)
      } else {
        getData()
        setSuccessCreate(true)
        handleClickSuccess()
      }

      return
    } catch (e) {
      console.log("There was a problem")
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

  // Function for retrieve all user data from the backend
  async function getData(e) {
    // e.preventDefault()
    try {
      const response = await Axios.get("http://localhost:8080/users")
      // console.log(response)
      if (!response) {
        return "No data exists in database"
      } else {
        setData(response.data)
        // console.log(response)
        // console.log(response.data[0])
      }
    } catch (e) {
      console.log("There was an issue with retrieval")
    }
  }

  async function updateSingleRow(newRow) {
    const updatedRow = { ...newRow, isNew: false }
    // console.log(updatedRow)
    const { id, username, password, email, status } = updatedRow

    const response = await Axios.post("http://localhost:8080/updateUser", { id: id, password: password, email: email, status: status })
    const err = response.data.errors

    if (err.length > 0) {
      // setErrors(getError(err))
      setErrors(err)
      setFail(true)
    } else if (err.length === 0) {
      return updatedRow
    }
  }

  // console.log(appState.usersData)
  console.log(error)
  const appState = useContext(StateContext)

  const currentUser = appState.user.username
  return (
    <Grid container direction={"column"} spacing={4}>
      <Collapse in={fail}>
        <Alert severity="warning">
          <AlertTitle>
            {(error || []).map((item, i) => (
              <li>{item.msg}</li>
            ))}
          </AlertTitle>
        </Alert>
      </Collapse>

      <Collapse in={success}>
        <Alert severity="success">Successfully Updated User</Alert>
      </Collapse>

      <Collapse in={successCreate}>
        <Alert severity="success">Created New User Successfully</Alert>
      </Collapse>
      <Grid container direction={"column"} spacing={4}></Grid>
      {/* <Grid item> */}
      <Grid item>
        <h2 className="intromsg">
          Welcome to the User Management Dashboard, <strong>{currentUser.toUpperCase()}</strong> !
        </h2>
      </Grid>
      {/* </Grid> */}
      <Grid item>
        <Grid container direction={"row"} spacing={1}>
          <Grid item></Grid>
          <Box>
            <Grid container direction={"column"} spacing={3}>
              <Grid item>
                <Grid container sx={gridStyles} direction={"row"} alignItems="center" justifyContent="center" spacing={5}>
                  <Grid item>
                    <TextField
                      InputProps={fontProps}
                      InputLabelProps={fontProps}
                      value={username}
                      label="Username"
                      placeholder="Enter Username"
                      required
                      onChange={e => {
                        setUsername(e.target.value)
                      }}
                      error={getError(errorCreate, "username") ? true : false}
                      helperText={getError(errorCreate, "username")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      InputProps={fontProps}
                      InputLabelProps={fontProps}
                      value={email}
                      label="Email"
                      placeholder="Enter Email"
                      required
                      onChange={e => {
                        setEmail(e.target.value)
                      }}
                      error={getError(errorCreate, "email") ? true : false}
                      helperText={getError(errorCreate, "email")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      InputProps={fontProps}
                      InputLabelProps={fontProps}
                      value={password}
                      label="Password"
                      placeholder="Enter Password"
                      type="password"
                      required
                      onChange={e => {
                        setPassword(e.target.value)
                      }}
                      error={getError(errorCreate, "password") ? true : false}
                      helperText={getError(errorCreate, "password")}
                    />
                  </Grid>
                  <Grid item>
                    <Button sx={buttonProps} type="submit" color="primary" variant="contained" fullWidth onClick={addUser}>
                      Create
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              {/* <div className="intromsg">
        <button name="button" onClick={getData}>
          Generate
        </button>
      </div> */}
              {/* <Grid container sx={gridStyles} direction={"row"} alignItems="center" justifyContent="center" spacing={5}> */}
              <Grid item>
                <Box sx={{ height: 400, width: 1000, paddingLeft: 5 }}>
                  <DataGrid
                    density="compact"
                    initialState={{
                      sorting: { sortModel: [{ field: "id", sort: "desc" }] },
                      columns: {
                        columnVisibilityModel: {
                          id: false
                        }
                      }
                    }}
                    components={{
                      LoadingOverlay: LinearProgress
                    }}
                    // Loading
                    // {...rows}
                    editMode="row"
                    processRowUpdate={updateSingleRow}
                    experimentalFeatures={{ newEditingApi: true }}
                    onProcessRowUpdateError={error => error}
                    checkboxSelection={boo}
                    selectionModel={selectionModel}
                    onSelectionModelChange={setSelectionModel}
                    columns={columns}
                    rows={temp}
                  />
                </Box>
              </Grid>
            </Grid>
            {/* </Grid> */}
          </Box>
          <Grid item>
            <Box>
              <Grid>
                <Grid item>
                  <Button>Toggle Checkbox</Button>
                </Grid>
                <Grid item>
                  <Button>Bulk Edit</Button>
                </Grid>
                <Grid item>Assign Group</Grid>
                <Grid item>Update Email</Grid>
                <Grid item>Update Password</Grid>
                <Grid item>Update Status</Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Table
