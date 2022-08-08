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
    height: 700,
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
        <div className={"close-btn-ctn"}>
          <h1 style={{ flex: "1 90%" }}>{item.title}</h1>
          <button className={"close-btn"} onClick={onClose}>
            X
          </button>
        </div>
        <h2>Description</h2>
        <div className={"prevent-overflow"}>
          <p>{item.content}</p>
        </div>
        <h2>Status</h2>
        <p>
          {item.icon}
          {`${item.status.charAt(0).toUpperCase()}${item.status.slice(1)}`}
        </p>
      </Box>
    </Modal>
  )
}

export default Window
