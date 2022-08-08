import React from "react"
import { useDrop } from "react-dnd"
import ITEM_TYPE from "../../data/types"
import { statuses } from "../../data/index"

const DropWrapper = ({ onDrop, children, status, group }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    canDrop: (item, monitor) => {
      // get the itemindex in status that matches the current item that is being dragged

      // finding column status index
      const itemIndex = statuses.findIndex(si => si.status === item.status)
      // console.log(itemIndex)
      // finding item's current status
      const statusIndex = statuses.findIndex(si => si.status === status)
      // console.log(statusIndex)
      // get from Open to-do-list (PM)
      if (group === "PM" && statusIndex === 1) {
        return [itemIndex + 1, itemIndex].includes(statusIndex)
      }
      // get from to-do-list to doing (TM)
      else if (group === "TM" && statusIndex === 2) {
        return [itemIndex + 1, itemIndex].includes(statusIndex)
      }
      // get from doing to to-do-list (TM)
      else if (group === "TM" && statusIndex === 1) {
        return [itemIndex - 1, itemIndex].includes(statusIndex)
      }
      // get from doing to done (TM)
      else if (group === "TM" && statusIndex === 3) {
        return [itemIndex + 1, itemIndex].includes(statusIndex)
      }
      // get from done to doing (PL)
      else if (group === "PL" && statusIndex === 2) {
        return [itemIndex - 1, itemIndex].includes(statusIndex)
      }
      // get from done to close (PL)
      else if (group === "PL" && statusIndex === 4) {
        return [itemIndex + 1, itemIndex].includes(statusIndex)
      } else {
        return
      }

      // if to the left or right or at current column, then can drop the draggable item
      // return [itemIndex + 1, itemIndex - 1, itemIndex].includes(statusIndex)
      // return [true, true]
    },
    drop: (item, monitor) => {
      onDrop(item, monitor, status)
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  })

  return (
    <div ref={drop} className={"drop-wrapper"}>
      {React.cloneElement(children, { isOver })}
    </div>
  )
}

export default DropWrapper
