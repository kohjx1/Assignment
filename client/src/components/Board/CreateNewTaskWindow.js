import React, { useState, useEffect } from "react"
// import Modal from "react-modal"
import { FormHelperText, Collapse, Alert, Button, Select, OutlinedInput, ListItemText, Checkbox, InputLabel, MenuItem, FormControl, Grid, Modal, Box, TextField } from "@mui/material"
import Axios from "axios"

const CreateNewTaskWindow = ({ open, onClose, userPermission }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedPlans, setSelectedPlans] = useState("")
  const [app, setApp] = useState("")

  // to collect initial data
  const [plans, setPlans] = useState([])
  const [apps, setApps] = useState([])

  const [success, setSuccess] = useState(false)

  const [errors, setErrors] = useState("")
  const [errorApp, setErrorApp] = useState("")

  const resetValues = () => {
    setName("")
    setDescription("")
    setNotes("")
    setSelectedPlans("")
    setApp("")
  }

  console.log(userPermission.filter(e => e.App_permit_Create === true))
  // console.log(apps)

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    height: 700,
    bgcolor: "background.paper",
    backgroundColor: "#333",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  }

  console.log(app)
  async function getPlans(e) {
    try {
      const response = await Axios.get("http://localhost:8080/getPlans")

      let plans = response.data
      let plansArr = plans.filter(e => e.Plan_app_Acronym === app)
      console.log(plansArr)
      let tmp = []
      for (var i = 0; i < plansArr.length; i++) {
        tmp.push(plansArr[i].Plan_MVP_name)
      }
      console.log(tmp)
      setPlans(tmp)
    } catch (e) {
      console.log("There was a problem")
      return
    }
  }

  async function getApps(e) {
    try {
      // const response = await Axios.get("http://localhost:8080/getApps")

      let filtered = userPermission.filter(e => e.App_permit_Create === true)
      let tmp = []

      for (var i = 0; i < filtered.length; i++) {
        tmp.push(filtered[i].appName)
      }
      setApps(tmp)

      // let tmp = []
      // for (var i = 0; i < response.data.length; i++) {
      //   tmp.push(response.data[i].App_Acronym)
      // }
      // console.log(tmp)
      // setApps(tmp)
    } catch (e) {
      console.log("There was a problem")
      return
    }
  }

  useEffect(() => {
    getPlans()
    getApps()
  }, [open])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccess(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [success])

  const getError = (errors, prop) => {
    try {
      return errors.filter(e => e.param === prop)[0].msg
    } catch (error) {
      return ""
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrors("")
    }, 1000)
    return () => clearTimeout(timeout)
  }, [getError])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorApp("")
    }, 1000)
    return () => clearTimeout(timeout)
  }, [errorApp])

  async function addTask(e) {
    if (!app) {
      setErrorApp("You need to select an application name to tag your task to")
    } else {
      const noapp = await Axios.post("http://localhost:8080/countTaskPerApp", { appname: app })

      const response = await Axios.post("http://localhost:8080/getTaskID", { name: app })

      var num = noapp.data[0].size + response.data[0].App_Rnumber
      var id = response.data[0].App_Acronym + "_" + num
      console.log(id)
      try {
        const responseCreate = await Axios.post("http://localhost:8080/createTask", { app: app, name: name, description: description, notes: notes, plan: selectedPlans, creator: sessionStorage.getItem("username"), id: id })
        const err = responseCreate.data.errors
        if (err) {
          console.log(err)
          setErrors(err)
        } else {
          setSuccess(true)
          window.location.reload()
          resetValues()
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  const renderList = item => {
    return item.map(e => <MenuItem value={e}>{e}</MenuItem>)
  }

  useEffect(() => {
    resetValues()
  }, [onClose])
  console.log(selectedPlans)
  console.log(app)

  const handleChange = e => {
    setApp(e.target.value)
  }

  useEffect(() => {
    getPlans()
  }, [app])

  return (
    <Modal keepMounted open={open} onClose={onClose} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description">
      <Box sx={style}>
        <Collapse in={success} className="parent">
          <Alert severity="success">Created New User Successfully</Alert>
        </Collapse>
        <Grid container direction={"column"} spacing={2}>
          <Grid item>
            <h2 className="newTask">New Task</h2>
          </Grid>

          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-simple-select-filled-label">Application</InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={app}
                onChange={handleChange}
                // error={getError(errors, "isappnameselected") ? true : false}
              >
                {renderList(apps)}
              </Select>
              <FormHelperText sx={{ color: "red" }}>{errorApp}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <TextField
              variant="filled"
              sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
              value={name}
              label="Task Name"
              placeholder="Enter New Task Name"
              fullWidth
              required
              onChange={e => {
                setName(e.target.value)
              }}
              error={getError(errors, "name") || getError(errors, "app") ? true : false}
              helperText={getError(errors, "name") || getError(errors, "app")}
            />
          </Grid>

          <Grid item>
            <textarea
              className="textarea"
              // style={{ resize: "none" }}
              value={description}
              placeholder="Enter Description"
              // cols="75"

              rows="2"
              onChange={e => {
                setDescription(e.target.value)
              }}
              defaultValue=""
              // error={fail ? true : false}
              // helperText={errors}
            />
          </Grid>

          <Grid item>
            <textarea
              className="textarea"
              value={notes}
              placeholder="Enter Notes"
              // cols="60"
              rows="5"
              onChange={e => {
                setNotes(e.target.value)
              }}
              // error={fail ? true : false}
              // helperText={errors}
            />
          </Grid>

          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-simple-select-filled-label">Plan</InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={selectedPlans}
                onChange={e => {
                  setSelectedPlans(e.target.value)
                }}
              >
                {renderList(plans)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <Button onClick={addTask} type="submit" color="primary" variant="contained" fullWidth>
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default CreateNewTaskWindow
