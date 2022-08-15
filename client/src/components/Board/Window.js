import React, { useEffect, useState, useContext } from "react"
// import Modal from "react-modal"
import { Modal, Box, Button } from "@mui/material"
import AssignPlanWindow from "./AssignPlanWindow"

//#root

// whether to show the window, what you do when close window and the actual item and the data associated with the item
const Window = ({ show, onClose, item, userPermission, items, setItems }) => {
  // console.log(userPermission)
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    height: 750,
    bgcolor: "background.paper",
    backgroundColor: "#333",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  }

  const [openAssignPlan, setOpenAssignPlan] = useState(false)
  const onOpenAssignPlan = () => setOpenAssignPlan(true)
  const onCloseAssignPlan = () => setOpenAssignPlan(false)

  function showEdit(item) {
    const createRights = userPermission.filter(e => e.appName === item.Task_app_Acronym)[0].App_permit_Create

    const doingRights = userPermission.filter(e => e.appName === item.Task_app_Acronym)[0].App_permit_Doing

    const doneRights = userPermission.filter(e => e.appName === item.Task_app_Acronym)[0].App_permit_Done

    const openRights = userPermission.filter(e => e.appName === item.Task_app_Acronym)[0].App_permit_Open

    const todoRights = userPermission.filter(e => e.appName === item.Task_app_Acronym)[0].App_permit_toDoList

    if ((item.Task_state === "to-do-list" && todoRights) || (item.Task_state === "open" && openRights) || (item.Task_state === "create" && createRights) || (item.Task_state === "doing" && doingRights) || (item.Task_state === "done" && doneRights) || (item.Task_state === "closed" && closed)) {
      return <Button>Edit</Button>
    } else {
      return ""
    }
  }

  return (
    // <Modal isOpen={show} onRequestClose={onClose} className={"modal"} overlayClassName={"overlay"}>
    <>
      <Modal keepMounted open={show} onClose={onClose} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description">
        <Box sx={style}>
          <div className="item-font-color">
            <h2 style={{ flex: "1 90%" }}>
              <strong style={{ color: "white" }}>{item.Task_name.toUpperCase()}</strong>
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
              <textarea defaultValue={item.Task_Description} cols="75" rows="3" readOnly />
            </div>
            <h2>Notes</h2>
            {/* <div className={"prevent-overflow"}> */}
            <div className="textarea-font-color">
              <textarea defaultValue={item.Task_notes} cols="75" rows="4" readOnly />
            </div>
            <h2>State</h2>
            <p>
              {item.icon}
              {`${item.Task_state.charAt(0).toUpperCase()}${item.Task_state.slice(1)}`}
            </p>
            {item.Task_state === "open" ? (
              <Button onClick={onOpenAssignPlan} type="submit" color="primary" variant="contained">
                Assign plan
              </Button>
            ) : (
              ""
            )}
            {/* {item.Task_state === "open" && userPermission.filter(i => i.appName === item.Task_app_Acronym)[0].App_permit_Open ? "hi" : "bye"} */}
            {/* {openRights && item.Task_state === "open" ? <button>Open Edit Rights</button> : ""} */}
            {/* {item.Task_state === "open" && userPermission.filter(i => i.appName === item.Task_app_Acronym)[0].App_permit_Open ? "hi" : "bye"} */}
            {showEdit(item)}
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
