import React, { useState, useEffect } from "react"
// import Modal from "react-modal"
import { Collapse, Alert, Button, Select, OutlinedInput, ListItemText, Checkbox, InputLabel, MenuItem, FormControl, Grid, Modal, Box, TextField } from "@mui/material"
import Axios from "axios"

function EditAppWindow({ open, onClose }) {
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
    height: 1000,
    bgcolor: "background.paper",
    backgroundColor: "#333",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  }

  const [names, setNames] = useState([])

  const [applications, setApplication] = useState([])

  const [appSelected, setAppSelected] = useState("")

  const [appName, setAppName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newCreate, setNewCreate] = useState([])
  const [newOpen, setNewOpen] = useState([])
  const [newToDo, setNewToDo] = useState([])
  const [newDoing, setNewDoing] = useState([])
  const [newDone, setNewDone] = useState([])
  const [newStartDate, setNewStartDate] = useState("")
  const [newEndDate, setNewEndDate] = useState("")

  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccess(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [success])

  async function getApplications() {
    try {
      const response = await Axios.get("http://localhost:8080/getApps")
      console.log(response)
      let tmp = []
      for (var i = 0; i < response.data.length; i++) {
        tmp.push(response.data[i].App_Acronym)
      }
      setApplication(tmp)
    } catch (e) {
      console.log("There was a problem")
      return
    }
  }

  async function onChangeHandle(e) {
    setAppSelected(e.target.value)
    try {
      const response = await Axios.post("http://localhost:8080/getSpecificAppDetails", { appname: e.target.value })
      let appname = e.target.value
      let description = response.data[0].App_Description
      let create = response.data[0].App_permit_Create
      let open = response.data[0].App_permit_Open
      let todo = response.data[0].App_permit_toDoList
      let doing = response.data[0].App_permit_Doing
      let done = response.data[0].App_permit_Done
      let startdate = response.data[0].App_startDate
      let enddate = response.data[0].App_endDate
      // console.log(todo)
      setAppName(appname)
      setNewDescription(description)
      // apply to the rest !!!!!!!
      setNewCreate(create.length === 0 ? [] : create.split(","))
      setNewOpen(open.length === 0 ? [] : open.split(","))
      setNewToDo(todo.length === 0 ? [] : todo.split(","))
      setNewDoing(doing.length === 0 ? [] : doing.split(","))
      setNewDone(done.length === 0 ? [] : done.split(","))
      setNewStartDate(startdate)
      setNewEndDate(enddate)

      console.log("Description: ", description, "create: ", create, "open: ", open, "todo: ", todo, "doing: ", doing, "done: ", done, "startdate: ", startdate, "enddate: ", enddate)
    } catch (e) {
      console.log("There was a problem with the onchange handle")
      return
    }
  }
  // console.log(newToDo)

  async function getGroups(e) {
    try {
      const response = await Axios.get("http://localhost:8080/getDistinctGroups")
      // console.log(response.data)
      let tmp = []
      for (var i = 0; i < response.data.length; i++) {
        tmp.push(response.data[i].groupname)
      }
      setNames(tmp)
    } catch (e) {
      console.log("There was a problem")
      return
    }
  }

  async function updateAppData(e) {
    try {
      const response = await Axios.post("http://localhost:8080/updateApplication", { appname: appName, description: newDescription, create: newCreate, open: newOpen, todo: newToDo, doing: newDoing, done: newDone, startdate: newStartDate, enddate: newEndDate })
      if (response) {
        setSuccess(true)
        // resetValues()
      }
      return
    } catch (e) {
      console.log(e)
    }
  }

  const resetValues = () => {
    setAppSelected("")
    setAppName("")
    setNewDescription("")
    setNewCreate([])
    setNewOpen([])
    setNewToDo([])
    setNewDoing([])
    setNewDone([])
    setNewStartDate("")
    setNewEndDate("")
  }

  useEffect(() => {
    resetValues()
  }, [onClose])

  useEffect(() => {
    getApplications()
    getGroups()
  }, [])

  // console.log(applications)
  const renderList = item => {
    return item.map(e => <MenuItem value={e}>{e}</MenuItem>)
  }
  console.log(names)
  console.log(newCreate)
  console.log(newOpen)
  console.log(newToDo)
  return (
    <Modal keepMounted open={open} onClose={onClose} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description">
      <Box sx={style}>
        <Collapse in={success} className="parent">
          <Alert severity="success">Created New User Successfully</Alert>
        </Collapse>
        <Grid container direction={"column"} spacing={2}>
          <Grid item>
            <h2 className="newTask">Edit App</h2>
          </Grid>

          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-simple-select-filled-label">Application</InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                // populate list with filtered values of those that already in
                value={appSelected}
                onChange={onChangeHandle}
              >
                {/* show existing list */}
                {renderList(applications)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <TextField
              variant="filled"
              sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
              value={newDescription}
              label="Application Description"
              placeholder="Update Application Description"
              fullWidth
              required
              onChange={e => {
                setNewDescription(e.target.value)
              }}
              // error={fail ? true : false}
              // helperText={errors}
            />
          </Grid>

          <Grid item>
            <TextField
              InputProps={{ sx: { height: 100 } }}
              variant="filled"
              sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
              value={newStartDate}
              label="Start Date"
              placeholder="Start Date"
              fullWidth
              required
              onChange={e => {
                setNewStartDate(e.target.value)
              }}
              type="date"
            />
          </Grid>

          <Grid item>
            <TextField
              InputProps={{ sx: { height: 100 } }}
              variant="filled"
              sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
              value={newEndDate}
              label="End Date"
              placeholder="End Date"
              fullWidth
              required
              onChange={e => {
                setNewEndDate(e.target.value)
              }}
              type="date"
            />
          </Grid>

          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-multiple-checkbox-label">Create (Project Lead)</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={newCreate}
                onChange={event => {
                  const {
                    target: { value }
                  } = event
                  setNewCreate(
                    // On autofill we get a stringified value.
                    typeof value === "string" ? value.split(",") : value
                  )
                }}
                input={<OutlinedInput label="Tag" />}
                renderValue={selected => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {names.map(name => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={newCreate.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-multiple-checkbox-label">Open (Project Manager)</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={newOpen}
                onChange={event => {
                  const {
                    target: { value }
                  } = event
                  setNewOpen(
                    // On autofill we get a stringified value.

                    typeof value === "string" ? value.split(",") : value
                  )
                }}
                input={<OutlinedInput label="Tag" />}
                renderValue={selected => (newOpen.length > 0 ? selected.join(", ") : selected.join(""))}
                MenuProps={MenuProps}
              >
                {names.map(name => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={newOpen.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-multiple-checkbox-label">To Do (Member)</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={newToDo}
                onChange={event => {
                  const {
                    target: { value }
                  } = event
                  setNewToDo(
                    // On autofill we get a stringified value.
                    typeof value === "string" ? value.split(",") : value
                  )
                }}
                input={<OutlinedInput label="Tag" />}
                renderValue={selected => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {names.map(name => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={newToDo.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-multiple-checkbox-label">Doing (Member)</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={newDoing}
                onChange={event => {
                  const {
                    target: { value }
                  } = event
                  setNewDoing(
                    // On autofill we get a stringified value.
                    typeof value === "string" ? value.split(",") : value
                  )
                }}
                input={<OutlinedInput label="Tag" />}
                renderValue={selected => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {names.map(name => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={newDoing.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-multiple-checkbox-label">Done (Project Lead)</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={newDone}
                onChange={event => {
                  const {
                    target: { value }
                  } = event
                  setNewDone(
                    // On autofill we get a stringified value.
                    typeof value === "string" ? value.split(",") : value
                  )
                }}
                input={<OutlinedInput label="Tag" />}
                renderValue={selected => (newDone.length > 1 ? selected.join(", ") : selected.join(""))}
                MenuProps={MenuProps}
              >
                {names.map(name => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={newDone.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <Button type="submit" color="primary" variant="contained" fullWidth onClick={updateAppData}>
              Update App
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default EditAppWindow
