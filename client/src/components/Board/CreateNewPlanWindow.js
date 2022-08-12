import React, { useState, useEffect } from "react"
// import Modal from "react-modal"
import { Collapse, Alert, Button, Select, OutlinedInput, ListItemText, Checkbox, InputLabel, MenuItem, FormControl, Grid, Modal, Box, TextField } from "@mui/material"
import Axios from "axios"

function CreateNewPlanWindow({ open, onClose, userPermission }) {
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

  const [planname, setPlanName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [appSelected, setAppSelected] = useState("")

  const [errors, setErrors] = useState("")
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)

  const resetValues = () => {
    setPlanName("")
    setStartDate("")
    setEndDate("")
    setAppSelected("")
  }

  function getApplications() {
    let filtered = userPermission.filter(e => e.App_permit_Open === true)
    let tmp = []

    for (var i = 0; i < filtered.length; i++) {
      tmp.push(filtered[i].appName)
    }
    return tmp
  }

  async function createPlan() {
    try {
      const response = await Axios.post("http://localhost:8080/createPlan", { planname: planname, startdate: startDate, enddate: endDate, appname: appSelected })
      const err = response.data.errors

      if (err) {
        setErrors(getError(err, "planname"))
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

  const onChangeHandle = e => {
    setAppSelected(e.target.value)
  }

  const renderList = item => {
    return item.map(e => <MenuItem value={e}>{e}</MenuItem>)
  }

  const getError = (errors, prop) => {
    try {
      return errors.filter(e => e.param === prop)[0].msg
    } catch (error) {
      return ""
    }
  }

  useEffect(() => {
    getApplications()
  }, [])

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

  // console.log(appSelected)

  return (
    <Modal keepMounted open={open} onClose={onClose} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description">
      <Box sx={style}>
        <Collapse in={success} className="parent">
          <Alert severity="success">Created New Plan Successfully</Alert>
        </Collapse>
        <Grid container direction={"column"} spacing={2}>
          <Grid item>
            <h2 className="newApplication">New Plan</h2>
          </Grid>
          <Grid item>
            <TextField
              variant="filled"
              sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
              value={planname}
              label="Plan Name"
              placeholder="Enter New Plan Name"
              fullWidth
              required
              onChange={e => {
                setPlanName(e.target.value)
              }}
              error={fail ? true : false}
              helperText={errors}
            />
          </Grid>
          {/* date start cannot be less than app date start and not more than app date end */}
          <Grid item>
            <TextField
              InputProps={{ sx: { height: 100 } }}
              variant="filled"
              sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
              value={startDate}
              label="Set Start Date"
              placeholder="Enter Start Date"
              fullWidth
              required
              onChange={e => {
                setStartDate(e.target.value)
              }}
              type="date"
            />
          </Grid>
          {/* date end cannot be less than date start, cannot be more than app date end */}
          <Grid item>
            <TextField
              InputProps={{ sx: { height: 100 } }}
              variant="filled"
              sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}
              value={endDate}
              label="Set End Date"
              placeholder="Enter End Date"
              fullWidth
              required
              onChange={e => {
                setEndDate(e.target.value)
              }}
              type="date"
            />
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
                {renderList(getApplications())}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button type="submit" color="primary" variant="contained" fullWidth onClick={createPlan}>
              Create Plan
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default CreateNewPlanWindow
