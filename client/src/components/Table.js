import React, { useState, useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import Axios from "axios"
import { DataGrid } from "@mui/x-data-grid"
import { Tooltip, FormControl, InputLabel, Select, MenuItem, IconButton, Typography, Box, Modal, ToggleButton, TextField, Button, Grid, Alert, Collapse, AlertTitle, LinearProgress } from "@mui/material"
import CheckIcon from "@mui/icons-material/Check"
import ModeTwoToneIcon from "@mui/icons-material/ModeTwoTone"
import CloseIcon from "@mui/icons-material/Close"

function Table() {
  //

  // const appDispatch = useContext(DispatchContext)
  // const appState = useContext(StateContext)
  const handleChange = event => {
    setStatusEdit(event.target.value)
  }

  const gridStyles = { paddingLeft: 0 }
  const fontProps = { style: { fontSize: 17.5 }, sx: { height: 45 } }
  const buttonProps = { backgroundColor: "#94128a", "&:hover": { backgroundColor: "#333" } }
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    height: 500,
    bgcolor: "background.paper",
    backgroundColor: "#333",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  }
  const closebutton = {
    cursor: "pointer",
    float: "right",
    marginTop: "3px",
    backgroundColor: "white",
    "&:hover": {
      color: "#94128a",
      backgroundColor: "white"
    }
  }

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setEmailEdit("")
    setStatusEdit("")
    setPasswordEdit("")
  }

  const [data, setData] = useState("")
  const [error, setErrors] = useState("")
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)

  const [emailEdit, setEmailEdit] = useState("")
  const [statusEdit, setStatusEdit] = useState("")
  const [passwordEdit, setPasswordEdit] = useState("")

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorCreate, setErrorsCreate] = useState("")
  const [successCreate, setSuccessCreate] = useState(false)
  const [failCreate, setFailCreate] = useState(false)
  const [selectionModel, setSelectionModel] = useState(temp)
  const [selected, setSelected] = useState(false)
  const [editVisible, setEditVisible] = useState(false)

  const [errorBulkUpdate, setErrorBulkUpdate] = useState("")
  const [successBulkUpdate, setSuccessBulkUpdate] = useState(false)

  // console.log(selectionModel)
  // console.log(selected)
  const handleClickSuccessBulk = () => {
    setUsername("")
    setEmail("")
    setPassword("")
    setErrorsCreate("")
    setSelectionModel([])
  }

  const handleClickSuccess = () => {
    setUsername("")
    setEmail("")
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
      setSuccessBulkUpdate(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [successBulkUpdate])

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
    const timeout = setTimeout(() => {
      setFailCreate(false)
      setErrorBulkUpdate("")
    }, 1500)

    return () => clearTimeout(timeout)
  }, [errorBulkUpdate])

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

  async function updateEmail() {
    const response = await Axios.post("http://localhost:8080/bulkUpdateEmail", { ids: selectionModel, email: emailEdit })
    const err = response.data.errors

    if (err) {
      setErrorBulkUpdate(err)
    } else if (!err) {
      getData()
      setSuccessBulkUpdate(true)
      handleClickSuccessBulk()
    }
  }

  async function updatePassword() {
    const response = await Axios.post("http://localhost:8080/bulkUpdatePassword", { ids: selectionModel, password: passwordEdit })
    const err = response.data.errors

    if (err) {
      setErrorBulkUpdate(err)
    } else if (!err) {
      getData()
      setSuccessBulkUpdate(true)
      handleClickSuccessBulk()
    }
  }

  async function updateStatus() {
    const response = await Axios.post("http://localhost:8080/bulkUpdateStatus", { ids: selectionModel, status: statusEdit === "enable" ? 1 : 0 })
    const err = response.data.errors

    if (err) {
      setErrorBulkUpdate(err)
    } else if (!err) {
      getData()
      setSuccessBulkUpdate(true)
      handleClickSuccessBulk()
    }
  }

  async function updateEmailPassword() {
    const response = await Axios.post("http://localhost:8080/bulkUpdateEmailPassword", { ids: selectionModel, email: emailEdit, password: passwordEdit })
    const err = response.data.errors

    if (err) {
      setErrorBulkUpdate(err)
    } else if (!err) {
      getData()
      setSuccessBulkUpdate(true)
      handleClickSuccessBulk()
    }
  }

  async function updatePasswordStatus() {
    const response = await Axios.post("http://localhost:8080/bulkUpdatePasswordStatus", { ids: selectionModel, password: passwordEdit, status: statusEdit === "enable" ? 1 : 0 })
    const err = response.data.errors

    if (err) {
      setErrorBulkUpdate(err)
    } else if (!err) {
      getData()
      setSuccessBulkUpdate(true)
      handleClickSuccessBulk()
    }
  }

  async function updateEmailStatus() {
    const response = await Axios.post("http://localhost:8080/bulkUpdateEmailStatus", { ids: selectionModel, email: emailEdit, status: statusEdit === "enable" ? 1 : 0 })
    const err = response.data.errors

    if (err) {
      setErrorBulkUpdate(err)
    } else if (!err) {
      getData()
      setSuccessBulkUpdate(true)
      handleClickSuccessBulk()
    }
  }

  async function updateAll() {
    const response = await Axios.post("http://localhost:8080/bulkUpdateEmailPasswordStatus", { ids: selectionModel, email: emailEdit, password: passwordEdit, status: statusEdit === "enable" ? 1 : 0 })
    const err = response.data.errors

    if (err) {
      setErrorBulkUpdate(err)
    } else if (!err) {
      getData()
      setSuccessBulkUpdate(true)
      handleClickSuccessBulk()
    }
  }

  const appState = useContext(StateContext)

  const currentUser = appState.user.username
  return (
    <div className="table-page">
      <Grid container direction={"column"} spacing={3}>
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
        <Grid container direction={"column"} spacing={2}></Grid>
        {/* <Grid item> */}
        <Grid item>
          <h2 className="intromsg">
            Welcome to the User Management Dashboard, <strong>{currentUser.toUpperCase()}</strong> !
          </h2>
        </Grid>
        {/* </Grid> */}
        <Grid item>
          <Grid container direction={"row"} spacing={0}>
            <Grid item></Grid>
            <Box>
              <Grid container direction={"column"} spacing={2}>
                <Grid item>
                  <Grid container sx={gridStyles} direction={"row"} spacing={5}>
                    <Grid item>
                      <TextField
                        sx={{ width: 200 }}
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
                        sx={{ width: 200 }}
                        InputProps={fontProps}
                        InputLabelProps={fontProps}
                        value={email}
                        label="Email"
                        placeholder="Enter Email"
                        onChange={e => {
                          setEmail(e.target.value)
                        }}
                        error={getError(errorCreate, "email") ? true : false}
                        helperText={getError(errorCreate, "email")}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        sx={{ width: 200 }}
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
                    {/* <Grid item>
                      <></>
                      <h2 style={{ width: 0 }}></h2>
                    </Grid> */}

                    <Grid item>
                      {(Array.isArray(selectionModel) && !selectionModel.length) || selectionModel === undefined ? (
                        ""
                      ) : (
                        <Tooltip title="Bulk Edit">
                          <Button onClick={handleOpen}>
                            <ModeTwoToneIcon />
                          </Button>
                        </Tooltip>
                      )}
                      <Tooltip title="Bulk Select">
                        <ToggleButton
                          value="check"
                          selected={selected}
                          onChange={() => {
                            setSelected(!selected)
                          }}
                        >
                          <CheckIcon />
                        </ToggleButton>
                      </Tooltip>
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
                  <Box sx={{ height: 400, width: 1000 }}>
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
                      checkboxSelection={selected}
                      selectionModel={selectionModel}
                      onSelectionModelChange={setSelectionModel}
                      columns={columns}
                      rows={temp}
                    />
                  </Box>
                </Grid>
              </Grid>
              <div>
                <Modal keepMounted open={open} onClose={handleClose} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description">
                  <Box sx={style}>
                    <Collapse in={successBulkUpdate}>
                      <Alert severity="success">Created New User Successfully</Alert>
                    </Collapse>

                    <IconButton onClick={handleClose} sx={closebutton}>
                      <CloseIcon />
                    </IconButton>

                    <Grid container direction="column" alignItems="center" justifyContent="center" spacing={5}>
                      <Grid item>
                        <TextField
                          variant="filled"
                          sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
                          InputProps={fontProps}
                          InputLabelProps={fontProps}
                          value={emailEdit}
                          label="Email"
                          onChange={e => {
                            setEmailEdit(e.target.value)
                          }}
                          error={getError(errorBulkUpdate, "email") ? true : false}
                          helperText={getError(errorBulkUpdate, "email")}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          variant="filled"
                          sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
                          InputProps={fontProps}
                          InputLabelProps={fontProps}
                          value={passwordEdit}
                          label="Password"
                          onChange={e => {
                            setPasswordEdit(e.target.value)
                          }}
                          error={getError(errorBulkUpdate, "password") ? true : false}
                          helperText={getError(errorBulkUpdate, "password")}
                        />
                      </Grid>
                      <Grid item>
                        <Box sx={{ minWidth: 120, bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
                          <FormControl fullWidth variant="filled">
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={statusEdit} label="Status" onChange={handleChange}>
                              {/* <MenuItem value={0}>No Selection</MenuItem> */}
                              <MenuItem value={"disable"}>Disable</MenuItem>
                              <MenuItem value={"enable"}>Enable</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item>
                        {emailEdit && !passwordEdit && !statusEdit ? (
                          <Button sx={buttonProps} type="submit" color="primary" variant="contained" fullWidth onClick={updateEmail}>
                            Update Email
                          </Button>
                        ) : !emailEdit && passwordEdit && !statusEdit ? (
                          <Button sx={buttonProps} type="submit" color="primary" variant="contained" fullWidth onClick={updatePassword}>
                            Update Password
                          </Button>
                        ) : !emailEdit && !passwordEdit && statusEdit ? (
                          <Button sx={buttonProps} type="submit" color="primary" variant="contained" fullWidth onClick={updateStatus}>
                            Update Status
                          </Button>
                        ) : emailEdit && passwordEdit && !statusEdit ? (
                          <Button sx={buttonProps} type="submit" color="primary" variant="contained" fullWidth onClick={updateEmailPassword}>
                            Update Email and Password
                          </Button>
                        ) : !emailEdit && passwordEdit && statusEdit ? (
                          <Button sx={buttonProps} type="submit" color="primary" variant="contained" fullWidth onClick={updatePasswordStatus}>
                            Update Password and Status
                          </Button>
                        ) : emailEdit && !passwordEdit && statusEdit ? (
                          <Button sx={buttonProps} type="submit" color="primary" variant="contained" fullWidth onClick={updateEmailStatus}>
                            Update Email and Status
                          </Button>
                        ) : emailEdit && passwordEdit && statusEdit ? (
                          <Button sx={buttonProps} type="submit" color="primary" variant="contained" fullWidth onClick={updateAll}>
                            Update All
                          </Button>
                        ) : (
                          ""
                        )}
                      </Grid>
                    </Grid>
                    {/* <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                    Text in a modal
                  </Typography>
                  <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                  </Typography> */}
                  </Box>
                </Modal>
              </div>
            </Box>
            <Grid item>
              {/* <Box>
                <Grid container sx={gridStyles} direction={"column"} alignItems="center" justifyContent="center" spacing={5}>
                  <Grid item>
                    <ToggleButton
                      value="check"
                      selected={selected}
                      onChange={() => {
                        setSelected(!selected)
                      }}
                    >
                      <CheckIcon />
                    </ToggleButton>
                  </Grid>
                  <Grid item>
                    {(Array.isArray(selectionModel) && !selectionModel.length) || selectionModel === undefined ? (
                      ""
                    ) : (
                      <Button onClick={handleOpen}>
                        <ModeTwoToneIcon />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box> */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default Table
