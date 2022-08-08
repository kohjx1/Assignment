import React, { useState, useEffect } from "react"
// import Modal from "react-modal"
import { Collapse, Alert, Button, Select, OutlinedInput, ListItemText, Checkbox, InputLabel, MenuItem, FormControl, Grid, Modal, Box, TextField } from "@mui/material"
import Axios from "axios"
//#root

// whether to show the window, what you do when close window and the actual item and the data associated with the item
const CreateWindow = ({ open, onClose }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [projectLead, setprojectLead] = useState([])
  const [projectManager, setprojectManager] = useState([])
  const [teamMember, setteamMember] = useState([])
  const [names, setNames] = useState([])
  const [errors, setErrors] = useState("")
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)

  const resetValues = () => {
    setName("")
    setDescription("")
    setprojectLead([])
    setprojectManager([])
    setteamMember([])
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFail(false)
      setErrors(false)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [fail])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccess(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [success])

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

  // const names = ["Oliver Hansen", "Van Henry", "April Tucker", "Ralph Hubbard", "Omar Alexander", "Carlos Abbott", "Miriam Wagner", "Bradley Wilkerson", "Virginia Andrews", "Kelly Snyder"]

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

  async function addApplication(e) {
    try {
      const response = await Axios.post("http://localhost:8080/createApp", { name: name, description: description, projectLead: projectLead, projectManager: projectManager, teamMember: teamMember })

      const err = response.data.errors

      if (err) {
        setErrors(getError(err, "name"))
        setFail(true)
      } else {
        setSuccess(true)
        resetValues()
      }
    } catch (e) {
      console.log("There was a problem")
      return
    }
  }

  useEffect(() => {
    getGroups()
  }, [])

  // function for capturing validation error message from backend
  const getError = (errors, prop) => {
    try {
      return errors.filter(e => e.param === prop)[0].msg
    } catch (error) {
      return ""
    }
  }

  return (
    // <Modal isOpen={show} onRequestClose={onClose} className={"modal"} overlayClassName={"overlay"}>

    <Modal keepMounted open={open} onClose={onClose} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description">
      <Box sx={style}>
        <Collapse in={success} className="parent">
          <Alert severity="success">Created New User Successfully</Alert>
        </Collapse>
        <Grid container direction={"column"} spacing={2}>
          <Grid item>
            <TextField
              variant="filled"
              sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
              value={name}
              label="Application Name"
              placeholder="Enter New Application Name"
              fullWidth
              required
              onChange={e => {
                setName(e.target.value)
              }}
              error={fail ? true : false}
              helperText={errors}
            />
          </Grid>

          <Grid item>
            <TextField
              variant="filled"
              sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
              value={description}
              label="Description"
              placeholder="Enter Description"
              fullWidth
              required
              onChange={e => {
                setDescription(e.target.value)
              }}
            />
          </Grid>
          {/* sx={{ m: 1, width: 300 }} */}
          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-multiple-checkbox-label">Project Lead</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={projectLead}
                onChange={event => {
                  const {
                    target: { value }
                  } = event
                  setprojectLead(
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
                    <Checkbox checked={projectLead.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-multiple-checkbox-label">Project Manager</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={projectManager}
                onChange={event => {
                  const {
                    target: { value }
                  } = event
                  setprojectManager(
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
                    <Checkbox checked={projectManager.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-multiple-checkbox-label">Team Member</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={teamMember}
                onChange={event => {
                  const {
                    target: { value }
                  } = event
                  setteamMember(
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
                    <Checkbox checked={teamMember.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <Button type="submit" color="primary" variant="contained" fullWidth onClick={addApplication}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default CreateWindow
