import React from "react"
// import Modal from "react-modal"
import { Modal, Box } from "@mui/material"

//#root

// whether to show the window, what you do when close window and the actual item and the data associated with the item
const Window = ({ show, onClose, item }) => {
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

  return (
    // <Modal isOpen={show} onRequestClose={onClose} className={"modal"} overlayClassName={"overlay"}>

    <Modal keepMounted open={show} onClose={onClose} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description">
      <Box sx={style}>
        <div className="item-font-color">
          <div className={"close-btn-ctn"}>
            <h1>
              {item.Task_app_Acronym} - <strong style={{ color: "white" }}>{item.Task_name.toUpperCase()} ({item.Task_id})</strong>
            </h1>
            {/* <h1 style={{ flex: "1 90%" }}>{item.Task_name}</h1> */}
            {/* <button className={"close-btn"} onClick={onClose}>
              X
            </button> */}
          </div>
          <h2>Description</h2>
          {/* <div className={"prevent-overflow"}> */}
          <div className="textarea-font-color">
            <textarea defaultValue={item.Task_Description} cols="75" rows="8" readOnly />
          </div>
          <h2>Notes</h2>
          {/* <div className={"prevent-overflow"}> */}
          <div className="textarea-font-color">
            <textarea defaultValue={item.Task_notes} cols="75" rows="8" readOnly />
          </div>
          <h2>State</h2>
          <p>
            {item.icon}
            {`${item.Task_state.charAt(0).toUpperCase()}${item.Task_state.slice(1)}`}
          </p>
        </div>
      </Box>
    </Modal>
  )
}

export default Window
