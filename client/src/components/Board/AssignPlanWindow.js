import React, { useState, useEffect } from "react"
// import Modal from "react-modal"
import { Collapse, Alert, Button, Select, OutlinedInput, ListItemText, Checkbox, InputLabel, MenuItem, FormControl, Grid, Modal, Box, TextField } from "@mui/material"
import Axios from "axios"
import { data, statuses } from "../../data/index"

function AssignPlanWindow({ id, item, open, onClose, userPermission, items, setItems }) {
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
    height: 300,
    bgcolor: "background.paper",
    backgroundColor: "#333",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  }

  const [tasks, setTasks] = useState([])
  const [plans, setPlans] = useState([])
  console.log(id)

  const [taskSelected, setTaskSelected] = useState("")
  const [planSelected, setPlanSelected] = useState("")

  const Child = async () => {
    try {
      const response = await Axios.get("http://localhost:8080/getTasks")

      // console.log(response.data)
      let tmp = []
      for (var i = 0; i < response.data.length; i++) {
        let mapping = statuses.find(si => si.Task_state === response.data[i].Task_state)
        let data = { ...response.data[i] }
        data.icon = mapping.icon
        tmp.push(data)
      }
      // console.log(tmp)
      setItems(tmp)
    } catch (e) {
      console.log(e)
      return
    }
  }
  // const resetValues = () => {
  //   setTasks([])
  //   setPlans([])
  //   setTaskSelected("")
  //   setPlanSelected("")
  // }

  function handleChange() {
    assignPlan()
    setPlanSelected("")
    onClose()
  }

  async function getPlans(e) {
    try {
      const response = await Axios.get("http://localhost:8080/getPlans")
      let plans = response.data

      const planArr = plans.filter(i => i.Plan_app_Acronym === item)
      let tmp = []
      for (var i = 0; i < planArr.length; i++) {
        tmp.push(planArr[i].Plan_MVP_name)
      }
      setPlans(tmp)
      console.log(planArr)
    } catch (e) {
      console.log(e)
    }
  }

  async function assignPlan(e) {
    try {
      const response = await Axios.post("http://localhost:8080/assignPlan", { taskID: id, plan: planSelected })
      Child()
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getPlans()
  }, [])

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

  // useEffect(() => {
  //   getTasks()
  // }, [open])

  // useEffect(() => {
  //   getPlans()
  // }, [taskSelected])

  // useEffect(() => {
  //   resetValues()
  // }, [onClose])

  // console.log(tasks)
  // console.log(taskSelected)
  // console.log(plans)

  return (
    <Modal keepMounted open={open} onClose={onClose} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description">
      <Box sx={style}>
        <Grid container direction={"column"} spacing={2}>
          <Grid item>
            <h2 className="newApplication">Assign Plan</h2>
          </Grid>

          <Grid item>
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "white", fontWeight: "fontWeightLight", borderRadius: 2 }}>
              <InputLabel id="demo-simple-select-filled-label">Plan</InputLabel>
              <Select
                disable={true}
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                // populate list with filtered values of those that already in
                value={planSelected}
                onChange={e => {
                  setPlanSelected(e.target.value)
                }}
              >
                {/* show existing list */}
                {plans ? renderList(plans) : []}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <div>{item}</div>
          </Grid>

          <Grid item>
            <Button onClick={handleChange} type="submit" color="primary" variant="contained" fullWidth>
              Assign Plan
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default AssignPlanWindow
