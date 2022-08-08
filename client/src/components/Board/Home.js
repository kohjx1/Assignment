import React, { useState } from "react"
import KanbanHeader from "./KanbanHeader"
import Item from "./Item"
import DropWrapper from "./DropWrapper"
import Col from "./Col"
import { data, statuses } from "../../data/index"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Modal, Box, TextField } from "@mui/material"
import CreateWindow from "./CreateWindow"

function Home() {
  const [items, setItems] = useState(data)
  const [openApp, setOpenCreateApplication] = useState(false)

  const onOpenApp = () => setOpenCreateApplication(true)
  const onCloseApp = () => setOpenCreateApplication(false)

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

  // change statuses of the items as it is dropped into a new column
  const onDrop = (item, monitor, status) => {
    // find status of dropped icon
    const mapping = statuses.find(si => si.status === status)

    // status becomes the status that was popped in
    // filter item that is going to be dropped, and add it back into the array
    setItems(prevState => {
      const newItems = prevState.filter(i => i.id !== item.id).concat({ ...item, status, icon: mapping.icon })
      return [...newItems]
    })
  }

  const moveItem = (dragIndex, hoverIndex) => {
    const item = items[dragIndex]

    // set previous item column to newstate with removed item
    setItems(prevState => {
      const newItems = prevState.filter((i, idx) => idx !== dragIndex)
      newItems.splice(hoverIndex, 0, item)
      return [...newItems]
    })
  }

  // testing
  const [group, setGroup] = useState("PL")

  return (
    // <>

    <DndProvider backend={HTML5Backend}>
      <KanbanHeader group={group} />
      <div className={"row"}>
        {statuses.map(s => {
          return (
            <div key={s.status} className={"col-wrapper"}>
              <h2 className={"col-header"}>{s.status.toUpperCase()}</h2>
              <DropWrapper onDrop={onDrop} status={s.status} group={group}>
                <Col>
                  {items
                    .filter(i => i.status === s.status)
                    .map((i, idx) => (
                      <Item key={i.id} item={i} index={idx} moveItem={moveItem} status={s} />
                    ))}
                </Col>
              </DropWrapper>
              {/* Only project lead can add new application  */}
              {s.status === "open" && group === "PL" ? (
                <>
                  <button onClick={onOpenApp} className="button-create">
                    Create New Application
                  </button>
                  <br></br>
                  <button className="button-create">Create Task</button>
                </>
              ) : s.status === "open" && group === "PM" ? (
                <>
                  {" "}
                  <button className="button-create">Create New Plan</button>
                  <br></br>
                  <button className="button-create">Assign Plan</button>
                </>
              ) : (
                ""
              )}
            </div>
          )
        })}
      </div>
      <CreateWindow open={openApp} onClose={onCloseApp} />
    </DndProvider>
    // </>
  )
}

export default Home
