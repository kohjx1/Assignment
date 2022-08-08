import React from "react"

function KanbanHeader({ group }) {
  return (
    <div className={"row"}>
      <h2>
        <strong>Board ({group})</strong>
      </h2>
    </div>
  )
}

export default KanbanHeader
