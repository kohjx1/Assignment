import React from "react"
import { useDrop } from "react-dnd"
import ITEM_TYPE from "../../data/types"
import { statuses } from "../../data/index"

const DropWrapper = ({ onDrop, children, status, userPermission, items, setItems }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    canDrop: (item, monitor) => {
      // get the itemindex in status that matches the current item that is being dragged

      // check if item belongs to list of approved apps to move
      // returns only specific app data in list with boolean values of each state column
      const itemPermissions = userPermission.filter(e => {
        return e.appName === item.Task_app_Acronym
      })

      // finding column status index
      const itemIndex = statuses.findIndex(si => si.Task_state === item.Task_state)

      // finding item's current status
      const statusIndex = statuses.findIndex(si => si.Task_state === status)

      // get from Open to-do-list (PM)

      if (itemPermissions[0].App_permit_Open && statusIndex === 1 && itemIndex === 0) {
        return [itemIndex + 1, itemIndex].includes(statusIndex)
      }

      // get from to-do-list to doing (TM)
      else if (itemPermissions[0].App_permit_toDoList && statusIndex === 2 && itemIndex === 1) {
        return [itemIndex + 1, itemIndex].includes(statusIndex)
      }

      // get from doing to to-do-list (TM)
      else if (itemPermissions[0].App_permit_Doing && statusIndex === 1 && itemIndex === 2) {
        return [itemIndex - 1, itemIndex].includes(statusIndex)
      }

      // get from doing to done (TM)
      else if (itemPermissions[0].App_permit_Doing && statusIndex === 3 && itemIndex === 2) {
        return [itemIndex + 1, itemIndex].includes(statusIndex)
      }

      // get from done to doing (PL)
      else if (itemPermissions[0].App_permit_Done && statusIndex === 2 && itemIndex === 3) {
        return [itemIndex - 1, itemIndex].includes(statusIndex)
      }

      // get from done to close (PL)
      else if (itemPermissions[0].App_permit_Done && statusIndex === 4 && itemIndex === 3) {
        return [itemIndex + 1, itemIndex].includes(statusIndex)
      } else {
        return [itemIndex].includes(statusIndex)
      }
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
