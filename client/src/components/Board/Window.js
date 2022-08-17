import React, { useEffect, useState, useContext } from "react"
// import Modal from "react-modal"
import { FormHelperText, Collapse, Alert, Button, Select, OutlinedInput, ListItemText, Checkbox, InputLabel, MenuItem, FormControl, Grid, Modal, Box, TextField } from "@mui/material"
import AssignPlanWindow from "./AssignPlanWindow"
import Axios from "axios"
import { data, statuses } from "../../data/index"

//#root

// whether to show the window, what you do when close window and the actual item and the data associated with the item
const Window = ({ show, onClose, item, userPermission, items, setItems }) => {
  // console.log(userPermission)

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1200,
    height: 1050,
    bgcolor: "background.paper",
    backgroundColor: "#333",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  }

  const [openAssignPlan, setOpenAssignPlan] = useState(false)
  const onOpenAssignPlan = () => setOpenAssignPlan(true)
  const onCloseAssignPlan = () => setOpenAssignPlan(false)

  const [noteHistory, setNoteHistory] = useState(item.Task_notes)
  const [readOnlyAccess, setReadOnlyAccess] = useState(true)

  const [description, setDescription] = useState(item.Task_Description)
  const [note, setNote] = useState("")

  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccess(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [success])

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

  useEffect(() => {
    Child()
  }, [show])

  function showEdit(item) {
    const createRights = userPermission.filter(e => e.appName === item.Task_app_Acronym)[0].App_permit_Create

    const doingRights = userPermission.filter(e => e.appName === item.Task_app_Acronym)[0].App_permit_Doing

    const doneRights = userPermission.filter(e => e.appName === item.Task_app_Acronym)[0].App_permit_Done

    const openRights = userPermission.filter(e => e.appName === item.Task_app_Acronym)[0].App_permit_Open

    const todoRights = userPermission.filter(e => e.appName === item.Task_app_Acronym)[0].App_permit_toDoList

    if ((item.Task_state === "to-do-list" && todoRights) || (item.Task_state === "open" && openRights) || (item.Task_state === "doing" && doingRights) || (item.Task_state === "done" && doneRights)) {
      setReadOnlyAccess(false)
    } else {
      setReadOnlyAccess(true)
    }
  }
  console.log(note)
  console.log(description)

  async function updateTask() {
    try {
      var today = new Date()

      var date = today.getFullYear() + "-" + (today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1) + "-" + (today.getDate() + 1 < 10 ? "0" + (today.getDate() + 1) : today.getDate() + 1)
      if (today.getMinutes() < 10) {
        var time = today.getHours() + ":0" + today.getMinutes() + ":" + today.getSeconds()
      } else {
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
      }
      let auditNote = `Date: ${date}        Time: ${time}        User: ${sessionStorage.getItem("username")}        State: ${item.Task_state}`

      if (description !== item.Task_Description && !note) {
        var newNote = item.Task_notes + auditNote + `\r\nDescription: ${description}\n\n`
      } else if (description === item.Task_Description && note) {
        var newNote = item.Task_notes + auditNote + `\r\nNote: ${note}\n\n`
      } else if (description !== item.Task_Description && note) {
        var newNote = item.Task_notes + auditNote + `\r\nDescription: ${description}` + `\r\nNote: ${note}\n\n`
      } else {
        var newNote = item.Task_notes
      }

      const response = await Axios.post("http://localhost:8080/updateTask", { username: sessionStorage.getItem("username"), taskID: item.Task_id, note: newNote, description: description })

      setNoteHistory(newNote)
      setNote("")
      Child()
      setSuccess(true)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    showEdit(item)
  }, [])

  return (
    // <Modal isOpen={show} onRequestClose={onClose} className={"modal"} overlayClassName={"overlay"}>
    <>
      <Modal keepMounted open={show} onClose={onClose} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description">
        <Box sx={style}>
          <Collapse in={success} className="parent">
            <Alert severity="success">Created New User Successfully</Alert>
          </Collapse>
          <div className="item-font-color">
            <h2 className="item-wrap">
              <strong style={{ color: "white" }}>{item.Task_name.toUpperCase()}</strong>
              {item.Task_state === "open" && userPermission.filter(e => e.appName === item.Task_app_Acronym)[0].App_permit_Open ? (
                <Button onClick={onOpenAssignPlan} type="submit" color="primary" variant="contained">
                  Assign plan
                </Button>
              ) : (
                ""
              )}
            </h2>
            <div className="item-wrap">
              <h4>App: {item.Task_app_Acronym}</h4>

              <h4>Plan: {item.Task_plan}</h4>
            </div>
            <div className="item-wrap">
              <h4>ID: {item.Task_id}</h4>
              <h4>Creator: {item.Task_creator}</h4>
            </div>
            <h2>Description</h2>
            {/* <div className={"prevent-overflow"}> */}
            <div className="textarea-font-color">
              <textarea className="textarea" value={description} onChange={e => setDescription(e.target.value)} cols="75" rows="2" readOnly={readOnlyAccess} />
            </div>
            <h2>Note History</h2>
            {/* <div className={"prevent-overflow"}> */}
            <div className="textarea-font-color">
              <textarea className="textarea" value={noteHistory} cols="75" rows="10" readOnly />
            </div>
            <h2>New Note</h2>
            {/* <div className={"prevent-overflow"}> */}
            <div className="textarea-font-color">
              <textarea className="textarea" value={note} onChange={e => setNote(e.target.value)} cols="75" rows="10" readOnly={readOnlyAccess} />
            </div>
            <h2>State</h2>
            <div className="item-wrap">
              <p>
                {item.icon}
                {`${item.Task_state.charAt(0).toUpperCase()}${item.Task_state.slice(1)}`}
              </p>

              {!readOnlyAccess && (description.length > item.Task_Description.length || note.length > 0) ? (
                <Button onClick={updateTask} type="submit" color="primary" variant="contained">
                  Commit Changes
                </Button>
              ) : (
                ""
              )}
            </div>

            {/* {item.Task_state === "open" ? (
              <Button onClick={onOpenAssignPlan} type="submit" color="primary" variant="contained">
                Assign plan
              </Button>
            ) : (
              ""
            )} */}
            {/* {item.Task_state === "open" && userPermission.filter(i => i.appName === item.Task_app_Acronym)[0].App_permit_Open ? "hi" : "bye"} */}
            {/* {openRights && item.Task_state === "open" ? <button>Open Edit Rights</button> : ""} */}
            {/* {item.Task_state === "open" && userPermission.filter(i => i.appName === item.Task_app_Acronym)[0].App_permit_Open ? "hi" : "bye"} */}
            {/* {showEdit(item)} */}
          </div>
        </Box>
      </Modal>
      <div>
        <AssignPlanWindow id={item.Task_id} item={item.Task_app_Acronym} open={openAssignPlan} onClose={onCloseAssignPlan} userPermission={userPermission} items={items} setItems={setItems} />
      </div>
    </>
  )
}

export default Window
