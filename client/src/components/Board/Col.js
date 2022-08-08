import React from "react"

// used to just highlight the drop column when item is hovered over it

const Col = ({ isOver, children }) => {
  const className = isOver ? " highlight-region" : ""

  return <div className={`col${className}`}>{children}</div>
}

export default Col
